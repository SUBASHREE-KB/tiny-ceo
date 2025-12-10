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

  async analyze(conversationAnalysis, options = {}) {
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

      const insights = await aiService.generateAgentAnalysis('ceo', conversationAnalysis, instructions, options);

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

  async generateTemplateInsights(conversationAnalysis) {
    // Generate AI-powered strategic intelligence for visualization data
    const strategicIntelligence = await this.generateStrategicIntelligence(conversationAnalysis);

    // Fallback template insights
    return {
      competitive_analysis: this.generateCompetitiveAnalysis({}, conversationAnalysis),
      roadmap: this.generateRoadmap(conversationAnalysis),
      fundraising: this.generateFundraisingStrategy({}, conversationAnalysis),
      pivot_signals: this.generatePivotSignals(conversationAnalysis),
      key_metrics: this.generateKeyMetrics(conversationAnalysis),
      strategic_recommendations: this.generateStrategicRecommendations({}, {}, conversationAnalysis),
      // New: Visualization data powered by AI analysis
      strategic_priorities: this.generateStrategicPriorities(conversationAnalysis, strategicIntelligence),
      growth_milestones: this.generateGrowthMilestones(conversationAnalysis, strategicIntelligence),
      competitive_positioning: this.generateCompetitivePositioning(conversationAnalysis, strategicIntelligence),
      risk_dashboard: this.generateRiskDashboard(conversationAnalysis, strategicIntelligence),
      market_opportunity: this.generateMarketOpportunity(conversationAnalysis, strategicIntelligence),
      swot_analysis: this.generateSWOTAnalysis(conversationAnalysis, strategicIntelligence),
      vision_mission: this.generateVisionMission(conversationAnalysis, strategicIntelligence),
      key_partnerships: this.generateKeyPartnerships(conversationAnalysis, strategicIntelligence)
    };
  }

  // Generate AI-powered strategic intelligence specific to the startup idea
  async generateStrategicIntelligence(conversationAnalysis) {
    const aiService = require('../services/ai.service');

    try {
      const prompt = `Analyze the strategic landscape for this startup and provide realistic data:

Startup Context:
- Industry: ${conversationAnalysis.industry}
- Target Audience: ${conversationAnalysis.targetAudience}
- Problem: ${conversationAnalysis.problem}
- Solution: ${conversationAnalysis.solution}
- Business Model: ${conversationAnalysis.businessModel}

Provide a JSON response with realistic strategic intelligence:
{
  "market_opportunity": {
    "tam_value": number (in USD, total addressable market),
    "growth_rate_annual": number (e.g., 0.18 for 18% CAGR),
    "market_maturity": "string (Early Stage|Growth|Mature)",
    "key_drivers": ["string (market growth drivers)"]
  },
  "competitive_landscape": {
    "competition_level": "string (Low|Medium|High)",
    "key_competitors": [
      {
        "name": "string (competitor name)",
        "strength_score": number (1-10),
        "weakness_areas": ["string"],
        "market_share_estimate": number (percentage)
      }
    ],
    "competitive_advantages": ["string (your advantages)"]
  },
  "growth_projections": {
    "customer_milestones": {
      "month_3": number,
      "month_6": number,
      "month_9": number,
      "month_12": number
    },
    "revenue_milestones": {
      "month_3": number,
      "month_6": number,
      "month_9": number,
      "month_12": number
    },
    "team_growth": {
      "month_3": number,
      "month_6": number,
      "month_9": number,
      "month_12": number
    }
  },
  "risk_factors": {
    "market_risks": [
      {
        "risk": "string",
        "likelihood": "string (Low|Medium|High)",
        "impact": "string (Low|Medium|High|Critical)",
        "mitigation": "string"
      }
    ],
    "execution_risks": [
      {
        "risk": "string",
        "likelihood": "string",
        "impact": "string",
        "mitigation": "string"
      }
    ],
    "competitive_risks": [
      {
        "risk": "string",
        "likelihood": "string",
        "impact": "string",
        "mitigation": "string"
      }
    ]
  },
  "strategic_priorities": [
    {
      "priority": "string",
      "description": "string",
      "impact_level": "string (CRITICAL|HIGH|MEDIUM)",
      "timeline": "string",
      "progress_estimate": number (0-100)
    }
  ],
  "key_milestones": [
    {
      "title": "string",
      "timeline": "string",
      "success_criteria": "string"
    }
  ],
  "swot_factors": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "partnerships": {
    "integration_partners": ["string (critical integrations needed)"],
    "distribution_partners": ["string (potential distribution channels)"],
    "strategic_alliances": ["string (complementary companies)"]
  }
}

Base your analysis on real market data for similar startups in the ${conversationAnalysis.industry} industry targeting ${conversationAnalysis.targetAudience}.`;

      const response = await aiService.generateCompletion(prompt, null, {
        temperature: 0.7
      });

      // Parse the AI response
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }

      const intelligence = JSON.parse(cleanResponse);
      logger.info('Strategic intelligence generated via AI', { industry: conversationAnalysis.industry });
      return intelligence;
    } catch (error) {
      logger.warn('AI strategic intelligence failed, using educated estimates', error);
      return this.generateFallbackStrategicIntelligence(conversationAnalysis);
    }
  }

  // Fallback strategic intelligence based on industry patterns
  generateFallbackStrategicIntelligence(conversationAnalysis) {
    const industryDefaults = {
      'SaaS': {
        tam_value: 50000000000,
        growth_rate: 0.18,
        competition_level: 'High',
        market_maturity: 'Growth'
      },
      'E-commerce': {
        tam_value: 100000000000,
        growth_rate: 0.15,
        competition_level: 'High',
        market_maturity: 'Mature'
      },
      'Fintech': {
        tam_value: 75000000000,
        growth_rate: 0.22,
        competition_level: 'Medium',
        market_maturity: 'Growth'
      },
      'Healthcare': {
        tam_value: 120000000000,
        growth_rate: 0.14,
        competition_level: 'Medium',
        market_maturity: 'Early Stage'
      }
    };

    const defaults = industryDefaults[conversationAnalysis.industry] || industryDefaults['SaaS'];

    return {
      market_opportunity: {
        tam_value: defaults.tam_value,
        growth_rate_annual: defaults.growth_rate,
        market_maturity: defaults.market_maturity,
        key_drivers: [
          'Digital transformation acceleration',
          'Remote work trends',
          'Automation demand',
          'Cost reduction pressures'
        ]
      },
      competitive_landscape: {
        competition_level: defaults.competition_level,
        key_competitors: [
          {
            name: `Established ${conversationAnalysis.industry} Leader`,
            strength_score: 8,
            weakness_areas: ['Legacy technology', 'Slow innovation', 'Complex pricing'],
            market_share_estimate: 35
          },
          {
            name: 'Emerging Startups',
            strength_score: 6,
            weakness_areas: ['Limited market presence', 'Fewer integrations'],
            market_share_estimate: 15
          },
          {
            name: 'DIY/Manual Solutions',
            strength_score: 4,
            weakness_areas: ['Time-consuming', 'Error-prone', 'Doesn\'t scale'],
            market_share_estimate: 25
          }
        ],
        competitive_advantages: [
          'Modern technology stack',
          'Superior user experience',
          'Faster innovation cycles',
          'Customer-centric approach'
        ]
      },
      growth_projections: {
        customer_milestones: {
          month_3: 50,
          month_6: 200,
          month_9: 500,
          month_12: 1000
        },
        revenue_milestones: {
          month_3: 2900,
          month_6: 11600,
          month_9: 29000,
          month_12: 58000
        },
        team_growth: {
          month_3: 2,
          month_6: 3,
          month_9: 5,
          month_12: 8
        }
      },
      risk_factors: {
        market_risks: [
          {
            risk: 'Market too small or assumptions wrong',
            likelihood: 'Low',
            impact: 'Critical',
            mitigation: 'Validated TAM through research'
          },
          {
            risk: 'Market timing - too early or late',
            likelihood: 'Medium',
            impact: 'High',
            mitigation: 'Strong demand signals validated'
          }
        ],
        execution_risks: [
          {
            risk: 'Cannot build product fast enough',
            likelihood: 'Medium',
            impact: 'High',
            mitigation: 'Use proven tech stack, hire contractors'
          },
          {
            risk: 'Poor product quality or UX',
            likelihood: 'Low',
            impact: 'Critical',
            mitigation: 'Focus on core features, extensive testing'
          }
        ],
        competitive_risks: [
          {
            risk: 'Well-funded competitor launches similar product',
            likelihood: 'Medium',
            impact: 'High',
            mitigation: 'Move fast, build community moat'
          },
          {
            risk: 'Price war with competitors',
            likelihood: 'Low',
            impact: 'Medium',
            mitigation: 'Compete on value, not price'
          }
        ]
      },
      strategic_priorities: [
        {
          priority: 'Achieve Product-Market Fit',
          description: 'Validate core value proposition with 50+ customers',
          impact_level: 'CRITICAL',
          timeline: 'Next 3 months',
          progress_estimate: 25
        },
        {
          priority: 'Build Scalable Acquisition Engine',
          description: 'Test and optimize 3 customer acquisition channels',
          impact_level: 'HIGH',
          timeline: 'Months 4-6',
          progress_estimate: 10
        },
        {
          priority: 'Raise Seed Funding',
          description: 'Secure $750K-$1.5M seed round',
          impact_level: 'HIGH',
          timeline: 'Months 7-9',
          progress_estimate: 5
        }
      ],
      key_milestones: [
        {
          title: 'MVP Launch',
          timeline: 'Month 3',
          success_criteria: '50 beta users, core features live'
        },
        {
          title: 'Initial Traction',
          timeline: 'Month 6',
          success_criteria: '$10K MRR, 200+ customers'
        },
        {
          title: 'Growth Mode',
          timeline: 'Month 9',
          success_criteria: 'Seed funding closed, team expansion'
        },
        {
          title: 'Series A Ready',
          timeline: 'Month 12',
          success_criteria: '$600K ARR, strong unit economics'
        }
      ],
      swot_factors: {
        strengths: [
          'Modern technology stack',
          'Founder domain expertise',
          'Customer-centric approach',
          'Lean and agile team'
        ],
        weaknesses: [
          'Limited brand awareness',
          'Small team capacity',
          'Funding constraints',
          'No existing customer base'
        ],
        opportunities: [
          'Large underserved mid-market',
          'Competitors slow to innovate',
          'Remote work trends',
          'Partnership opportunities'
        ],
        threats: [
          'Well-funded competitor launches',
          'Economic downturn',
          'Market consolidation',
          'Technology shifts'
        ]
      },
      partnerships: {
        integration_partners: [
          'Slack',
          'Google Workspace',
          'Microsoft 365',
          'Zapier'
        ],
        distribution_partners: [
          'Industry associations',
          'Complementary SaaS tools',
          'Consulting firms'
        ],
        strategic_alliances: [
          'Non-competing tools serving same audience',
          'Industry influencers',
          'Technology platforms'
        ]
      }
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

  // Generate strategic priorities for visualization
  generateStrategicPriorities(analysis, strategicIntelligence) {
    // Use AI-generated priorities or fallback to defaults
    const aiPriorities = strategicIntelligence.strategic_priorities || [];

    const top_3_priorities = aiPriorities.slice(0, 3).map((priority, index) => ({
      title: priority.priority,
      description: priority.description,
      impact: priority.impact_level,
      timeline: priority.timeline,
      progress: priority.progress_estimate,
      status: index === 0 ? 'in_progress' : 'planned',
      icon: index === 0 ? 'target' : index === 1 ? 'trending_up' : 'dollar'
    }));

    // If AI didn't generate enough priorities, use defaults
    if (top_3_priorities.length === 0) {
      top_3_priorities.push(
        {
          title: 'Achieve Product-Market Fit',
          description: '20+ customer interviews, iterate based on feedback, achieve 70%+ engagement',
          impact: 'CRITICAL',
          timeline: 'Next 3 months',
          progress: 25,
          status: 'in_progress',
          icon: 'target'
        },
        {
          title: 'Build Scalable Acquisition Engine',
          description: 'Test 3 channels, double down on what works, reach $10K MRR',
          impact: 'HIGH',
          timeline: 'Months 4-6',
          progress: 10,
          status: 'planned',
          icon: 'trending_up'
        },
        {
          title: 'Raise Seed Round',
          description: 'Prepare pitch deck, financial model, reach out to 50+ investors',
          impact: 'HIGH',
          timeline: 'Months 7-9',
          progress: 5,
          status: 'planned',
          icon: 'dollar'
        }
      );
    }

    return {
      top_3_priorities,
      quick_wins: [
        { action: 'Launch landing page with email capture', impact: 'Start building audience', effort: 'Low' },
        { action: 'Set up analytics and tracking', impact: 'Data-driven decisions', effort: 'Low' },
        { action: 'Create founder LinkedIn content', impact: 'Build personal brand', effort: 'Medium' },
        { action: 'Join 3 relevant communities', impact: 'Network and learn', effort: 'Low' }
      ]
    };
  }

  // Generate growth milestones visualization
  generateGrowthMilestones(analysis, strategicIntelligence) {
    // Use AI-generated milestones
    const aiMilestones = strategicIntelligence.key_milestones || [];
    const customerMilestones = strategicIntelligence.growth_projections?.customer_milestones || {};
    const revenueMilestones = strategicIntelligence.growth_projections?.revenue_milestones || {};
    const teamGrowth = strategicIntelligence.growth_projections?.team_growth || {};

    const milestones = [];

    if (aiMilestones.length > 0) {
      // Use AI-generated milestones with AI-generated metrics
      const timelineMap = { 'Month 3': 3, 'Month 6': 6, 'Month 9': 9, 'Month 12': 12 };

      aiMilestones.forEach((milestone, index) => {
        const month = timelineMap[milestone.timeline] || (index + 1) * 3;
        const monthKey = `month_${month}`;

        milestones.push({
          month,
          title: milestone.title,
          metrics: {
            users: customerMilestones[monthKey] || (index + 1) * 200,
            mrr: revenueMilestones[monthKey] || (index + 1) * 10000,
            team: teamGrowth[monthKey] || (index + 1) * 2
          },
          key_achievement: milestone.success_criteria,
          status: 'upcoming'
        });
      });
    }

    // If no AI milestones, use defaults
    if (milestones.length === 0) {
      milestones.push(
        {
          month: 3,
          title: 'MVP Launch',
          metrics: { users: 50, mrr: 0, team: 2 },
          key_achievement: '50 beta users, core features live',
          status: 'upcoming'
        },
        {
          month: 6,
          title: 'Initial Traction',
          metrics: { users: 500, mrr: 10000, team: 3 },
          key_achievement: 'First paying customers, $10K MRR',
          status: 'upcoming'
        },
        {
          month: 9,
          title: 'Growth Mode',
          metrics: { users: 2000, mrr: 35000, team: 5 },
          key_achievement: 'Seed funding closed, team expansion',
          status: 'upcoming'
        },
        {
          month: 12,
          title: 'Series A Ready',
          metrics: { users: 5000, mrr: 60000, team: 8 },
          key_achievement: '$600K ARR, strong unit economics',
          status: 'upcoming'
        }
      );
    }

    return {
      milestones,
      current_stage: 'Pre-Launch',
      next_milestone: milestones[0] ? `${milestones[0].title} in ${milestones[0].month} months` : 'MVP Launch in 3 months'
    };
  }

  // Generate competitive positioning visualization
  generateCompetitivePositioning(analysis, strategicIntelligence) {
    const competitors = strategicIntelligence.competitive_landscape?.key_competitors || [];
    const advantages = strategicIntelligence.competitive_landscape?.competitive_advantages || [];

    // Build positioning matrix from AI data
    const positioning_matrix = [
      { competitor: 'You', price: 3, features: 4, ease_of_use: 5, innovation: 5 }
    ];

    competitors.forEach(comp => {
      const strengthScore = comp.strength_score || 5;
      positioning_matrix.push({
        competitor: comp.name,
        price: strengthScore > 7 ? 1 : strengthScore > 5 ? 3 : 4,
        features: strengthScore > 7 ? 5 : strengthScore > 5 ? 3 : 2,
        ease_of_use: comp.weakness_areas?.includes('complex') || comp.weakness_areas?.includes('Legacy') ? 2 : 3,
        innovation: strengthScore > 7 ? 2 : strengthScore > 5 ? 4 : 3
      });
    });

    // If no competitors from AI, use defaults
    if (positioning_matrix.length === 1) {
      positioning_matrix.push(
        { competitor: 'Enterprise Leader', price: 1, features: 5, ease_of_use: 2, innovation: 2 },
        { competitor: 'Startup Competitor', price: 4, features: 3, ease_of_use: 4, innovation: 4 },
        { competitor: 'DIY Solution', price: 5, features: 1, ease_of_use: 1, innovation: 1 }
      );
    }

    // Build advantages from AI data
    const your_advantages = advantages.slice(0, 4).map((adv, index) => ({
      advantage: adv,
      strength: 95 - (index * 5)
    }));

    if (your_advantages.length === 0) {
      your_advantages.push(
        { advantage: 'Modern UX', strength: 95 },
        { advantage: 'Speed to Value', strength: 90 },
        { advantage: 'Pricing Flexibility', strength: 85 },
        { advantage: 'Customer Support', strength: 80 }
      );
    }

    return {
      positioning_matrix,
      your_advantages,
      market_gaps: [
        { gap: 'Mid-market segment underserved', opportunity: 'High' },
        { gap: 'Integration with modern tools', opportunity: 'High' },
        { gap: 'Self-service onboarding', opportunity: 'Medium' }
      ]
    };
  }

  // Generate risk dashboard
  generateRiskDashboard(analysis, strategicIntelligence) {
    const riskFactors = strategicIntelligence.risk_factors || {};

    const risk_factors = [
      {
        category: 'Market Risk',
        risks: riskFactors.market_risks || [
          { risk: 'Market too small', likelihood: 'Low', impact: 'Critical', mitigation: 'Validated TAM at $45B+' },
          { risk: 'Timing - too early/late', likelihood: 'Medium', impact: 'High', mitigation: 'Strong current demand signals' }
        ]
      },
      {
        category: 'Execution Risk',
        risks: riskFactors.execution_risks || [
          { risk: 'Can\'t build fast enough', likelihood: 'Medium', impact: 'High', mitigation: 'Use no-code tools, hire contractors' },
          { risk: 'Poor product quality', likelihood: 'Low', impact: 'Critical', mitigation: 'Focus on core features, extensive testing' }
        ]
      },
      {
        category: 'Competitive Risk',
        risks: riskFactors.competitive_risks || [
          { risk: 'Big player enters market', likelihood: 'Medium', impact: 'High', mitigation: 'Move fast, build moat via community' },
          { risk: 'Price war', likelihood: 'Low', impact: 'Medium', mitigation: 'Compete on value, not price' }
        ]
      }
    ];

    // Calculate overall risk score based on AI data
    const impactScores = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    const likelihoodScores = { 'Low': 1, 'Medium': 2, 'High': 3 };

    let totalRiskScore = 0;
    let riskCount = 0;

    risk_factors.forEach(category => {
      category.risks.forEach(risk => {
        const impactScore = impactScores[risk.impact] || 2;
        const likelihoodScore = likelihoodScores[risk.likelihood] || 2;
        totalRiskScore += (impactScore * likelihoodScore);
        riskCount++;
      });
    });

    const averageRiskScore = riskCount > 0 ? totalRiskScore / riskCount : 6.5;
    const risk_rating = averageRiskScore > 8 ? 'High' : averageRiskScore > 5 ? 'Moderate' : 'Low';

    return {
      risk_factors,
      overall_risk_score: parseFloat(averageRiskScore.toFixed(1)),
      risk_rating
    };
  }

  // Generate market opportunity analysis
  generateMarketOpportunity(analysis, strategicIntelligence) {
    const marketOpp = strategicIntelligence.market_opportunity || {};
    const tamValue = marketOpp.tam_value || 45000000000;
    const growthRate = marketOpp.growth_rate_annual || 0.18;
    const maturityStage = marketOpp.market_maturity || 'Growth';
    const keyDrivers = marketOpp.key_drivers || [
      'Digital transformation acceleration',
      'Remote work trends',
      'Automation demand',
      'Cost reduction pressures'
    ];

    // Calculate SAM and SOM from TAM
    const samValue = tamValue * 0.19; // ~19% of TAM
    const somValue = tamValue * 0.0095; // ~0.95% of TAM

    const formatValue = (value) => {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      return `$${value.toLocaleString()}`;
    };

    return {
      market_size: {
        tam: { value: formatValue(tamValue), description: 'Total Addressable Market globally' },
        sam: { value: formatValue(samValue), description: 'Serviceable Available Market (US + Canada)' },
        som: { value: formatValue(somValue), description: 'Serviceable Obtainable Market (realistic 3-year target)' }
      },
      market_dynamics: {
        growth_rate: `${(growthRate * 100).toFixed(0)}% CAGR`,
        maturity_stage: maturityStage,
        key_drivers: keyDrivers,
        market_trends: [
          'Shift from legacy on-premise to cloud solutions',
          'Preference for best-of-breed over all-in-one platforms',
          'Rising importance of integrations and ecosystem',
          'Focus on user experience and ease of adoption'
        ]
      },
      target_market_share: {
        year_1: { percentage: '0.01%', revenue: formatValue(tamValue * 0.0001) },
        year_3: { percentage: '0.1%', revenue: formatValue(tamValue * 0.001) },
        year_5: { percentage: '0.5%', revenue: formatValue(tamValue * 0.005) }
      },
      market_entry_barriers: {
        low: ['Technology is accessible', 'Cloud infrastructure readily available'],
        medium: ['Building brand awareness', 'Acquiring initial customers'],
        high: ['Competing with established players', 'Enterprise sales cycles']
      }
    };
  }

  // Generate SWOT analysis
  generateSWOTAnalysis(analysis, strategicIntelligence) {
    const swotFactors = strategicIntelligence.swot_factors || {};

    const strengths = (swotFactors.strengths || []).map((item, index) => ({
      item,
      impact: index < 2 ? 'High' : 'Medium',
      description: `Enables competitive advantage in ${analysis.industry}`
    }));

    if (strengths.length === 0) {
      strengths.push(
        { item: 'Modern technology stack', impact: 'High', description: 'Enables faster iteration and innovation' },
        { item: 'Founder domain expertise', impact: 'High', description: 'Deep understanding of customer pain points' },
        { item: 'Lean and agile team', impact: 'Medium', description: 'Can pivot quickly based on feedback' },
        { item: 'Customer-centric approach', impact: 'High', description: 'Build what customers actually need' }
      );
    }

    const weaknesses = (swotFactors.weaknesses || []).map(item => ({
      item,
      impact: item.toLowerCase().includes('brand') || item.toLowerCase().includes('customer') ? 'High' : 'Medium',
      description: 'Area for improvement',
      mitigation: item.toLowerCase().includes('brand') ? 'Content marketing and thought leadership' :
                  item.toLowerCase().includes('team') ? 'Hire strategically, outsource non-core' :
                  item.toLowerCase().includes('funding') ? 'Raise seed round by Month 9' :
                  'Beta program and early adopter incentives'
    }));

    if (weaknesses.length === 0) {
      weaknesses.push(
        { item: 'Limited brand awareness', impact: 'High', description: 'Unknown in the market', mitigation: 'Content marketing and thought leadership' },
        { item: 'Small team', impact: 'Medium', description: 'Limited capacity', mitigation: 'Hire strategically, outsource non-core' },
        { item: 'Funding constraints', impact: 'Medium', description: 'Limited runway', mitigation: 'Raise seed round by Month 9' },
        { item: 'No existing customer base', impact: 'High', description: 'Starting from zero', mitigation: 'Beta program and early adopter incentives' }
      );
    }

    const opportunities = (swotFactors.opportunities || []).map((item, index) => ({
      item,
      impact: index === 0 ? 'Critical' : 'High',
      timeframe: index < 2 ? 'Immediate' : '6-12 months',
      action: `Capitalize on ${item.toLowerCase()}`
    }));

    if (opportunities.length === 0) {
      opportunities.push(
        { item: 'Large underserved mid-market', impact: 'Critical', timeframe: 'Immediate', action: 'Focus GTM on this segment' },
        { item: 'Competitors slow to innovate', impact: 'High', timeframe: '12-18 months', action: 'Move fast on product roadmap' },
        { item: 'Remote work trends', impact: 'High', timeframe: 'Ongoing', action: 'Position as remote-first solution' },
        { item: 'Partnership opportunities', impact: 'Medium', timeframe: '6-12 months', action: 'Identify complementary tools' }
      );
    }

    const threats = (swotFactors.threats || []).map(item => ({
      item,
      impact: item.toLowerCase().includes('competitor') || item.toLowerCase().includes('downturn') ? 'High' : 'Medium',
      likelihood: item.toLowerCase().includes('competitor') ? 'Medium' : 'Low',
      response: item.toLowerCase().includes('competitor') ? 'Build strong community and brand loyalty early' :
                item.toLowerCase().includes('downturn') ? 'Emphasize ROI and cost savings' :
                item.toLowerCase().includes('consolidation') ? 'Be acquisition target or unique differentiator' :
                'Stay close to emerging tech trends'
    }));

    if (threats.length === 0) {
      threats.push(
        { item: 'Well-funded competitor launches similar product', impact: 'High', likelihood: 'Medium', response: 'Build strong community and brand loyalty early' },
        { item: 'Economic downturn reduces budgets', impact: 'High', likelihood: 'Low', response: 'Emphasize ROI and cost savings' },
        { item: 'Market consolidation', impact: 'Medium', likelihood: 'Medium', response: 'Be acquisition target or unique differentiator' },
        { item: 'Technology shift makes approach obsolete', impact: 'Critical', likelihood: 'Low', response: 'Stay close to emerging tech trends' }
      );
    }

    return {
      strengths,
      weaknesses,
      opportunities,
      threats,
      strategic_implications: [
        'Lead with strengths: Technology and customer focus',
        'Address weaknesses: Build brand through content and community',
        'Seize opportunities: Mid-market and remote work trends',
        'Mitigate threats: Move fast, build defensible moat'
      ]
    };
  }

  // Generate vision and mission
  generateVisionMission(analysis, strategicIntelligence) {
    // Use startup-specific context to create personalized vision/mission
    const targetAudience = analysis.targetAudience || 'businesses';
    const solution = analysis.solution || 'achieve their goals';
    const problem = analysis.problem || 'their biggest challenges';
    const industry = analysis.industry || 'technology';

    return {
      vision: {
        statement: `To become the leading platform empowering ${targetAudience} to ${solution} through innovative technology`,
        time_horizon: '5-10 years',
        success_looks_like: [
          `Category leader in ${industry}`,
          'Trusted by 10,000+ companies globally',
          'Known for best-in-class user experience',
          'Strong community of advocates and champions'
        ]
      },
      mission: {
        statement: `We help ${targetAudience} solve ${problem} by providing ${solution} that save time, reduce errors, and enable growth`,
        core_purpose: `Make ${solution.toLowerCase()} accessible to everyone, not just enterprises`,
        daily_focus: [
          'Deliver exceptional customer value',
          'Iterate based on user feedback',
          'Build a sustainable, profitable business',
          'Create a great place to work'
        ]
      },
      core_values: [
        { value: 'Customer Obsession', description: 'We start with customer needs and work backwards' },
        { value: 'Move Fast', description: 'Speed is a competitive advantage - iterate and improve daily' },
        { value: 'Quality Matters', description: 'Excellence in everything we ship, no shortcuts' },
        { value: 'Transparency', description: 'Open communication with team, customers, and investors' },
        { value: 'Sustainable Growth', description: 'Build for the long-term, not just quick wins' }
      ],
      north_star_metric: 'Weekly Active Users (WAU) who complete core action',
      culture_principles: [
        'Default to action - test and learn vs endless planning',
        'Customer feedback > opinions - let users guide us',
        'Simplicity > complexity - solve it the simple way first',
        'Ownership mindset - everyone is a CEO of their domain'
      ]
    };
  }

  // Generate key partnerships
  generateKeyPartnerships(analysis, strategicIntelligence) {
    const partnerships = strategicIntelligence.partnerships || {};
    const integrationPartners = partnerships.integration_partners || ['Slack', 'Google Workspace', 'Zapier'];
    const distributionPartners = partnerships.distribution_partners || ['Industry associations'];
    const strategicAlliances = partnerships.strategic_alliances || ['Complementary SaaS tools'];

    return {
      integration_partners: integrationPartners.slice(0, 3).map((partner, index) => ({
        partner,
        type: 'Integration',
        priority: index === 0 ? 'Critical' : 'High',
        why: `${index === 0 ? '80%' : '60%'} of target customers use ${partner}`,
        value: 'Embed our solution in their workflow',
        timeline: `Month ${index + 2}`
      })),
      distribution_partners: distributionPartners.slice(0, 2).map((partner, index) => ({
        partner,
        type: index === 0 ? 'Distribution' : 'Strategic Alliance',
        priority: 'Medium',
        why: index === 0 ? 'Direct access to target audience' : 'Serve same customer base, non-competing',
        value: index === 0 ? 'Co-marketing, webinars, member discounts' : 'Cross-promotion, referral partnerships',
        timeline: index === 0 ? 'Month 6-9' : 'Month 9-12'
      })),
      technology_partners: [
        {
          partner: 'AWS / Google Cloud',
          type: 'Infrastructure',
          priority: 'Critical',
          why: 'Core hosting and services',
          value: 'Reliable, scalable infrastructure + startup credits',
          timeline: 'Day 1'
        },
        {
          partner: 'Stripe',
          type: 'Payments',
          priority: 'Critical',
          why: 'Need robust payment processing',
          value: 'Easy subscription billing and management',
          timeline: 'Month 1'
        }
      ],
      advisory_partnerships: [
        {
          partner: 'Industry Veteran Advisors',
          type: 'Advisory',
          priority: 'High',
          why: 'Need domain expertise and network',
          value: 'Strategic guidance, intro to customers and investors',
          compensation: '0.25-0.5% equity, 4-year vest',
          timeline: 'Month 3-6'
        },
        {
          partner: 'Technical Advisors',
          type: 'Advisory',
          priority: 'Medium',
          why: 'Navigate technical architecture decisions',
          value: 'Scalability, security, best practices',
          compensation: '0.1-0.25% equity',
          timeline: 'As needed'
        }
      ],
      partnership_strategy: {
        focus_areas: ['Integrations first', 'Distribution second', 'Advisory ongoing'],
        success_metrics: ['# of active integrations', 'Partner-sourced leads', 'Advisor engagement'],
        resources_needed: '$10K-20K/year for partnership tools and programs'
      }
    };
  }
}

module.exports = CEOAgent;
