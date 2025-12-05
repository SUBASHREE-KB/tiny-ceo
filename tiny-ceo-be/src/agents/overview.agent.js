const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');

/**
 * Overview Agent
 * Synthesizes insights from all agents into executive summary and action plan
 */
class OverviewAgent extends BaseAgent {
  constructor() {
    super(
      'Overview',
      'Executive Advisor & Strategy Synthesizer',
      [
        'Executive summary generation',
        'Opportunity scoring',
        'Quick wins identification',
        'Risk prioritization',
        'Action plan creation',
        'Resource allocation'
      ]
    );
  }

  async analyze(conversationAnalysis, agentOutputs = {}, options = {}) {
    logger.agent('Overview', 'Starting overview synthesis');

    const aiService = require('../services/ai.service');

    try {
      const instructions = `You are the Chief Strategy Officer synthesizing insights from your entire leadership team (CEO, Finance, Marketing, Sales, Developer).

ANALYZE ALL TEAM INSIGHTS DEEPLY:
${Object.keys(agentOutputs).length > 0 ? `
Available Team Insights:
${Object.entries(agentOutputs).map(([team, data]) => `
${team.toUpperCase()} TEAM:
${JSON.stringify(data, null, 2)}
`).join('\n')}
` : ''}

Generate a comprehensive executive overview with this EXACT JSON structure:
{
  "executive_summary": {
    "one_sentence_pitch": "string (elevator pitch combining problem, solution, target market)",
    "opportunity_overview": "string (2-3 sentences on market opportunity, business model, and growth potential)",
    "market_context": {
      "industry": "string",
      "market_size": "string (TAM from marketing team)",
      "growth_rate": "string",
      "competitive_position": "string (from CEO competitive analysis)"
    },
    "business_model": {
      "revenue_model": "string (from finance team pricing)",
      "primary_tier": "string (most popular tier from finance)",
      "distribution": "string (GTM from marketing/sales)",
      "gross_margin": "string"
    },
    "financial_highlights": {
      "year_1_arr": "string (from finance projections)",
      "year_3_arr": "string (from finance projections)",
      "unit_economics": "string (LTV:CAC from finance)",
      "breakeven": "string (timeline from finance)",
      "funding_need": "string (from finance budget)"
    },
    "key_strengths": ["string (5-7 strengths from ALL teams)"],
    "key_challenges": ["string (5-7 challenges from ALL teams)"]
  },
  "next_steps": [
    {
      "step": "string (specific, actionable task)",
      "priority": "High|Medium|Low",
      "owner": "CEO|CTO|CFO|CMO|Sales Lead",
      "timeline": "This week|This month|Next quarter",
      "why": "string (business impact - reference specific team insights)",
      "dependencies": ["string (what needs to happen first)"]
    }
  ],
  "key_risks": [
    {
      "risk": "string (specific risk from team analysis)",
      "severity": "Critical|High|Medium|Low",
      "source_team": "string (which team identified this)",
      "mitigation": "string (concrete mitigation strategy)",
      "when_to_address": "Immediate|Short-term|Monitor"
    }
  ],
  "success_metrics": [
    {
      "metric": "string (KPI name)",
      "target": "string (specific target value)",
      "timeframe": "string (when to achieve)",
      "source": "string (which team defined this)"
    }
  ]
}

CRITICAL REQUIREMENTS:
1. NEXT STEPS must be 8-12 specific actions synthesized from:
   - Developer team's MVP features and timeline
   - Finance team's budget and funding needs
   - Marketing team's GTM strategy and channels
   - Sales team's lead gen and ICP validation
   - CEO team's competitive positioning

2. Each next step MUST reference actual insights from the teams (e.g., "Based on Developer's 10-week timeline...")

3. KEY RISKS must combine risks from ALL teams (technical, market, financial, GTM)

4. EXECUTIVE SUMMARY must use actual data from teams (real pricing tiers, real tech stack, real market size)

5. Be specific with numbers, timelines, and concrete actions - not generic advice

Conversation Context: ${JSON.stringify(conversationAnalysis, null, 2)}

Now synthesize this into actionable strategic guidance.`;

      const insights = await aiService.generateAgentAnalysis('overview', {
        ...conversationAnalysis,
        agentOutputs
      }, instructions, options);

      if (insights.error) {
        logger.warn('Overview AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis, agentOutputs);
      }

      logger.agent('Overview', 'Overview synthesis completed');
      return insights;
    } catch (error) {
      logger.error('Overview analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis, agentOutputs);
    }
  }

  generateTemplateInsights(conversationAnalysis, agentOutputs) {
    return {
      executive_summary: this.generateExecutiveSummary(conversationAnalysis, agentOutputs),
      opportunity_score: this.calculateOpportunityScore(conversationAnalysis, agentOutputs),
      quick_wins: this.identifyQuickWins(conversationAnalysis, agentOutputs),
      critical_risks: this.prioritizeRisks(conversationAnalysis, agentOutputs),
      next_steps: this.createActionPlan(conversationAnalysis, agentOutputs),
      resource_requirements: this.defineResourceRequirements(agentOutputs),
      success_milestones: this.defineMilestones(agentOutputs),
      decision_framework: this.createDecisionFramework(conversationAnalysis)
    };
  }

  generateExecutiveSummary(analysis, agentOutputs) {
    const { industry, targetAudience, problem, solution, uniqueValue } = analysis;

    const financeData = agentOutputs.finance || {};
    const marketingData = agentOutputs.marketing || {};

    const unitEcon = financeData.unit_economics || {};
    const ltvCacRatio = unitEcon.ltv_to_cac_ratio?.ratio || '8:1';

    return {
      one_sentence_pitch: `${solution} for ${targetAudience} in the ${industry} industry`,

      opportunity_overview: `A ${industry} solution targeting ${targetAudience}. The product addresses ${problem} through ${uniqueValue}. With a clear go-to-market strategy focused on product-led growth and content marketing, combined with strong unit economics (${ltvCacRatio} LTV:CAC ratio), this represents a significant market opportunity with a realistic path to $2M+ ARR by year 3.`,

      market_context: {
        industry: industry,
        market_size: marketingData.market_analysis?.market_size?.tam || '$50B+ total addressable market',
        growth_rate: '10-20% YoY industry growth',
        competitive_position: 'Opportunity to differentiate through superior UX and modern technology'
      },

      business_model: {
        revenue_model: 'SaaS subscription with tiered pricing',
        primary_tier: 'Professional ($79/mo) - expected 45-50% of customers',
        distribution: 'Product-led growth with sales assist for enterprise',
        gross_margin: '85%+'
      },

      financial_highlights: {
        year_1_arr: financeData.revenue_projections?.year_1?.realistic?.arr || '$210K ARR realistic case',
        year_3_arr: financeData.revenue_projections?.year_3?.realistic || '$1.8M ARR realistic case',
        unit_economics: ltvCacRatio + ' LTV:CAC ratio (excellent)',
        breakeven: financeData.breakeven?.timeline || 'Month 16-20',
        funding_need: '$750K seed round for 18-month runway'
      },

      key_strengths: [
        `Strong value proposition: ${uniqueValue}`,
        'Large addressable market with clear segmentation',
        'Healthy unit economics from day one',
        'Product-led growth model reduces CAC',
        'Modern tech stack enables rapid iteration'
      ],

      key_challenges: [
        'Competition from established players and emerging startups',
        'Need to prove product-market fit quickly',
        'Building brand awareness in crowded market',
        'Scaling customer acquisition efficiently'
      ]
    };
  }

  calculateOpportunityScore(analysis, agentOutputs) {
    let score = 0;
    const breakdown = {};

    // Market Size & Growth (25 points)
    breakdown.market_opportunity = this.scoreMarketOpportunity(analysis);
    score += breakdown.market_opportunity;

    // Competitive Position (20 points)
    breakdown.competitive_position = this.scoreCompetitivePosition(analysis, agentOutputs);
    score += breakdown.competitive_position;

    // Business Model Viability (20 points)
    breakdown.business_model = this.scoreBusinessModel(agentOutputs);
    score += breakdown.business_model;

    // Execution Feasibility (20 points)
    breakdown.execution_feasibility = this.scoreExecutionFeasibility(agentOutputs);
    score += breakdown.execution_feasibility;

    // Financial Viability (15 points)
    breakdown.financial_viability = this.scoreFinancialViability(agentOutputs);
    score += breakdown.financial_viability;

    const verdict = this.getOpportunityVerdict(score);

    return {
      overall_score: score,
      max_score: 100,
      percentage: score + '%',
      verdict: verdict.verdict,
      recommendation: verdict.recommendation,
      breakdown: {
        market_opportunity: { score: breakdown.market_opportunity, max: 25 },
        competitive_position: { score: breakdown.competitive_position, max: 20 },
        business_model: { score: breakdown.business_model, max: 20 },
        execution_feasibility: { score: breakdown.execution_feasibility, max: 20 },
        financial_viability: { score: breakdown.financial_viability, max: 15 }
      },
      score_interpretation: {
        '80-100': 'Exceptional opportunity - pursue aggressively',
        '60-79': 'Strong opportunity - proceed with confidence',
        '40-59': 'Moderate opportunity - proceed with caution',
        '20-39': 'Weak opportunity - significant pivots needed',
        '0-19': 'Poor opportunity - consider alternatives'
      }
    };
  }

  scoreMarketOpportunity(analysis) {
    let score = 15; // Base score

    const growthIndustries = ['ai', 'fintech', 'healthcare', 'saas', 'edtech'];
    if (growthIndustries.some(ind => analysis.industry.toLowerCase().includes(ind))) {
      score += 5;
    }

    if (analysis.targetAudience && analysis.targetAudience.length > 15) {
      score += 3;
    }

    if (analysis.problem && analysis.problem.length > 30) {
      score += 2;
    }

    return Math.min(score, 25);
  }

  scoreCompetitivePosition(analysis, agentOutputs) {
    let score = 12; // Base score

    if (analysis.uniqueValue && analysis.uniqueValue.length > 20) {
      score += 4;
    }

    const ceoData = agentOutputs.ceo || {};
    if (ceoData.competitive_analysis && ceoData.competitive_analysis.length >= 3) {
      score += 4;
    }

    return Math.min(score, 20);
  }

  scoreBusinessModel(agentOutputs) {
    let score = 12; // Base score

    const financeData = agentOutputs.finance || {};
    if (financeData.pricing && financeData.pricing.tiers) {
      score += 4;
    }

    if (financeData.unit_economics) {
      score += 4;
    }

    return Math.min(score, 20);
  }

  scoreExecutionFeasibility(agentOutputs) {
    let score = 12; // Base score

    const devData = agentOutputs.developer || {};
    if (devData.timeline && devData.timeline.total_weeks <= 12) {
      score += 4;
    }

    if (devData.mvp_features && devData.mvp_features.length > 0) {
      score += 4;
    }

    return Math.min(score, 20);
  }

  scoreFinancialViability(agentOutputs) {
    let score = 10; // Base score

    const financeData = agentOutputs.finance || {};

    if (financeData.unit_economics?.ltv_to_cac_ratio?.ratio) {
      const ratio = parseFloat(financeData.unit_economics.ltv_to_cac_ratio.ratio);
      if (ratio >= 6) score += 3;
      else if (ratio >= 3) score += 2;
    }

    if (financeData.breakeven) {
      score += 2;
    }

    return Math.min(score, 15);
  }

  getOpportunityVerdict(score) {
    if (score >= 80) {
      return {
        verdict: 'Exceptional Opportunity',
        recommendation: 'Pursue aggressively. Strong product-market fit potential with healthy economics.'
      };
    } else if (score >= 60) {
      return {
        verdict: 'Strong Opportunity',
        recommendation: 'Proceed with confidence. Solid fundamentals with clear path to success.'
      };
    } else if (score >= 40) {
      return {
        verdict: 'Moderate Opportunity',
        recommendation: 'Proceed cautiously. Validate assumptions quickly and be ready to pivot.'
      };
    } else if (score >= 20) {
      return {
        verdict: 'Weak Opportunity',
        recommendation: 'Significant concerns. Consider major pivots or alternative opportunities.'
      };
    } else {
      return {
        verdict: 'Poor Opportunity',
        recommendation: 'Not recommended. Fundamental issues with market, model, or execution.'
      };
    }
  }

  identifyQuickWins(analysis, agentOutputs) {
    return [
      {
        win: 'Launch MVP in 10-12 weeks',
        impact: 'Start validating product-market fit and gathering real user feedback',
        effort: 'High',
        timeline: '10-12 weeks',
        dependencies: ['Secure funding', 'Hire/assemble dev team', 'Finalize MVP scope'],
        success_criteria: 'MVP deployed to production, accessible to beta users'
      },
      {
        win: 'Recruit 30-50 beta users through direct outreach',
        impact: 'Early feedback, testimonials, and potential paying customers',
        effort: 'Medium',
        timeline: '2-4 weeks',
        dependencies: ['Identify target users', 'Craft outreach message', 'Set up tracking'],
        success_criteria: '30+ active beta users providing weekly feedback'
      },
      {
        win: 'Create content foundation (landing page + 5 blog posts)',
        impact: 'SEO groundwork, credibility, inbound lead generation',
        effort: 'Low',
        timeline: '2-3 weeks',
        dependencies: ['Define target keywords', 'Write/edit content', 'Publish and promote'],
        success_criteria: 'Published and ranking for target keywords within 3 months'
      },
      {
        win: 'Set up analytics and tracking infrastructure',
        impact: 'Data-driven decisions from day one',
        effort: 'Low',
        timeline: '1 week',
        dependencies: ['Choose tools', 'Implement tracking', 'Create dashboards'],
        success_criteria: 'Tracking user behavior, conversion funnel, and key metrics'
      },
      {
        win: 'Achieve $5K MRR within first 6 months',
        impact: 'Prove business model viability and extend runway through revenue',
        effort: 'High',
        timeline: '6 months from launch',
        dependencies: ['Product-market fit', 'Effective GTM', 'Strong onboarding'],
        success_criteria: '$5K+ in monthly recurring revenue, <30% churn'
      }
    ];
  }

  prioritizeRisks(analysis, agentOutputs) {
    const ceoRisks = agentOutputs.ceo?.critical_risks || [];
    const devRisks = agentOutputs.developer?.technical_risks || [];

    const allRisks = [
      {
        risk: 'Competition from well-funded incumbents',
        category: 'Market',
        probability: 'High',
        impact: 'High',
        severity_score: 9,
        mitigation: [
          'Focus on underserved niche they can\'t serve well',
          'Move faster than they can respond',
          'Build strong community and brand',
          'Deliver exceptional customer experience'
        ],
        early_warning_signs: [
          'Competitor launches similar product',
          'Competitor acquires startup in space',
          'Major competitor PR announcements'
        ]
      },
      {
        risk: 'Failure to achieve product-market fit',
        category: 'Product',
        probability: 'Medium',
        impact: 'Critical',
        severity_score: 8,
        mitigation: [
          'Talk to customers constantly (weekly)',
          'Ship MVP fast to start learning',
          'Be willing to pivot based on feedback',
          'Track engagement metrics obsessively'
        ],
        early_warning_signs: [
          'Churn rate >10% monthly',
          'Low engagement in trial period',
          'Consistently negative feedback',
          'Customers not understanding value prop'
        ]
      },
      {
        risk: 'Customer acquisition costs exceed projections',
        category: 'Go-to-Market',
        probability: 'Medium',
        impact: 'High',
        severity_score: 7,
        mitigation: [
          'Test multiple acquisition channels early',
          'Focus on product-led growth to reduce CAC',
          'Build referral program',
          'Optimize conversion funnel continuously'
        ],
        early_warning_signs: [
          'CAC trending above $250',
          'Paid channels not profitable',
          'Low conversion rates (<2%)',
          'High CPL and CPC'
        ]
      },
      {
        risk: 'Technical execution delays',
        category: 'Execution',
        probability: 'Medium',
        impact: 'Medium',
        severity_score: 5,
        mitigation: [
          'Hire experienced developers',
          'Use proven tech stack',
          'Scope MVP tightly',
          'Weekly progress reviews',
          'Have contingency budget for contractors'
        ],
        early_warning_signs: [
          'Missing sprint goals 2+ times',
          'Tech debt accumulating',
          'Team morale issues',
          'Scope creep'
        ]
      },
      {
        risk: 'Unable to raise follow-on funding',
        category: 'Financial',
        probability: 'Low-Medium',
        impact: 'Critical',
        severity_score: 6,
        mitigation: [
          'Hit Series A milestones ($1M ARR, strong growth)',
          'Build relationships with VCs early',
          'Maintain 18+ month runway',
          'Have bridge round options ready'
        ],
        early_warning_signs: [
          'Runway <9 months',
          'Not hitting growth targets',
          'Investor feedback is lukewarm',
          'Market conditions deteriorating'
        ]
      }
    ];

    return allRisks.sort((a, b) => b.severity_score - a.severity_score);
  }

  createActionPlan(analysis, agentOutputs) {
    return {
      immediate: {
        priority: 'This Week',
        timeframe: 'Days 1-7',
        actions: [
          {
            action: 'Finalize MVP feature list',
            owner: 'Founders',
            output: 'Prioritized feature list with must-haves and nice-to-haves clearly separated',
            estimated_time: '4 hours'
          },
          {
            action: 'Set up development environment and tools',
            owner: 'Tech lead',
            output: 'GitHub repo, CI/CD pipeline, project management tools configured',
            estimated_time: '1 day'
          },
          {
            action: 'Create simple landing page with email capture',
            owner: 'Founder/Designer',
            output: 'Live landing page collecting waitlist signups',
            estimated_time: '1 day'
          },
          {
            action: 'Conduct 5 customer development interviews',
            owner: 'Founder',
            output: 'Interview notes, key insights, validation of problem/solution fit',
            estimated_time: '3 days'
          }
        ]
      },

      short_term: {
        priority: 'This Month',
        timeframe: 'Weeks 1-4',
        actions: [
          {
            action: 'Complete database schema and core architecture',
            owner: 'Tech team',
            output: 'Database designed, core APIs scaffolded',
            estimated_time: '2 weeks'
          },
          {
            action: 'Recruit 20 beta users from target market',
            owner: 'Founder',
            output: 'Beta user waitlist with engaged early adopters',
            estimated_time: '2 weeks'
          },
          {
            action: 'Write and publish first 3 blog posts',
            owner: 'Founder/Content writer',
            output: '3 SEO-optimized blog posts published',
            estimated_time: '2 weeks'
          },
          {
            action: 'Set up analytics (Google Analytics, Mixpanel)',
            owner: 'Tech team',
            output: 'Full event tracking and conversion funnel monitoring',
            estimated_time: '3 days'
          },
          {
            action: 'Develop pricing strategy and tier structure',
            owner: 'Founder',
            output: 'Finalized pricing with rationale and positioning',
            estimated_time: '1 week'
          }
        ]
      },

      medium_term: {
        priority: 'First Quarter (3 Months)',
        timeframe: 'Months 1-3',
        actions: [
          {
            action: 'Build and launch MVP',
            owner: 'Tech team',
            output: 'MVP in production with core features working',
            estimated_time: '10 weeks'
          },
          {
            action: 'Onboard first 30-50 beta users',
            owner: 'Founder + team',
            output: 'Active beta users providing feedback and testimonials',
            estimated_time: 'Ongoing'
          },
          {
            action: 'Iterate based on user feedback',
            owner: 'Product team',
            output: 'Product improvements addressing top user requests',
            estimated_time: 'Ongoing'
          },
          {
            action: 'Prepare fundraising materials',
            owner: 'Founder',
            output: 'Pitch deck, financial model, data room',
            estimated_time: '2 weeks'
          },
          {
            action: 'Launch initial paid acquisition tests',
            owner: 'Marketing',
            output: 'Google Ads and LinkedIn campaigns live, early CAC data',
            estimated_time: '2 weeks'
          }
        ]
      },

      long_term: {
        priority: 'First Year',
        timeframe: 'Months 4-12',
        actions: [
          {
            action: 'Public product launch',
            owner: 'Full team',
            output: 'Product Hunt launch, press coverage, initial traction',
            timeline: 'Month 4'
          },
          {
            action: 'Achieve $10K MRR milestone',
            owner: 'Full team',
            output: '$10K+ in monthly recurring revenue',
            timeline: 'Month 6'
          },
          {
            action: 'Expand team (2-3 key hires)',
            owner: 'Founders',
            output: 'Marketing lead, sales rep, or additional engineer hired',
            timeline: 'Months 6-9'
          },
          {
            action: 'Reach $50K MRR',
            owner: 'Full team',
            output: '$50K+ MRR with clear path to $100K',
            timeline: 'Month 12'
          },
          {
            action: 'Prepare for Series A',
            owner: 'Founders',
            output: 'Series A deck, warm investor intros, growth metrics documented',
            timeline: 'Month 12'
          }
        ]
      }
    };
  }

  defineResourceRequirements(agentOutputs) {
    const financeData = agentOutputs.finance || {};
    const budget = financeData.budget || {};

    return {
      team: {
        current: '2 technical co-founders',
        month_6: '+ 1 growth/marketing hire',
        month_12: '+ 1 sales/customer success + 1 engineer',
        roles_to_hire: [
          {
            role: 'Growth Marketer',
            timing: 'Month 6-9',
            why: 'Scale content and paid acquisition',
            cost: '$60-80K + equity'
          },
          {
            role: 'Sales/Customer Success',
            timing: 'Month 9-12',
            why: 'Handle demos, close deals, reduce churn',
            cost: '$50-70K + commission'
          },
          {
            role: 'Additional Engineer',
            timing: 'Month 12+',
            why: 'Accelerate product development',
            cost: '$80-100K + equity'
          }
        ]
      },

      funding: {
        seed_round: budget.funding_requirements?.seed_raise || '$750K',
        runway: budget.funding_requirements?.runway || '18 months',
        use_of_funds: budget.year_1_expenses?.breakdown || [],
        fundraising_timeline: '3-6 months (start month 1)'
      },

      tools_and_infrastructure: {
        total_monthly_cost: '$2,000-3,000',
        essential_tools: [
          { tool: 'Cloud hosting (AWS/GCP)', cost: '$500-1,500/mo' },
          { tool: 'CRM (HubSpot)', cost: '$0-50/mo (free tier)' },
          { tool: 'Analytics (Mixpanel)', cost: '$0-100/mo (free tier)' },
          { tool: 'Email (SendGrid)', cost: '$15-100/mo' },
          { tool: 'Customer support (Intercom)', cost: '$0-100/mo' },
          { tool: 'Project mgmt (Linear/Jira)', cost: '$0-50/mo' },
          { tool: 'Design (Figma)', cost: '$45/mo' }
        ]
      },

      timeline: '10 weeks to MVP, 6 months to initial traction, 12 months to Series A readiness'
    };
  }

  defineMilestones(agentOutputs) {
    return [
      {
        milestone: 'Beta Launch with 30-50 Users',
        timeline: 'Month 3',
        success_criteria: [
          '30+ active beta users',
          '>70% weekly engagement',
          'NPS >50',
          '5+ testimonials collected'
        ],
        next_steps_if_achieved: 'Launch public version and start paid acquisition',
        next_steps_if_missed: 'Extend beta, gather more feedback, iterate on core value prop'
      },
      {
        milestone: '$5K MRR',
        timeline: 'Month 5-6',
        success_criteria: [
          '$5K+ monthly recurring revenue',
          '75-100 paying customers',
          '<5% monthly churn',
          'CAC <$250'
        ],
        next_steps_if_achieved: 'Scale paid marketing, hire growth marketer',
        next_steps_if_missed: 'Optimize conversion funnel, improve trial experience, test pricing'
      },
      {
        milestone: '$10K MRR',
        timeline: 'Month 6-8',
        success_criteria: [
          '$10K+ monthly recurring revenue',
          '150-200 paying customers',
          'Clear product-market fit signals',
          'Positive unit economics proven'
        ],
        next_steps_if_achieved: 'Accelerate hiring, increase marketing budget',
        next_steps_if_missed: 'Reassess GTM strategy, consider channel pivots'
      },
      {
        milestone: '$50K MRR',
        timeline: 'Month 12',
        success_criteria: [
          '$50K+ MRR ($600K ARR run rate)',
          '700-900 paying customers',
          '15%+ monthly growth',
          'Team of 5-7 people',
          'Proven, repeatable sales process'
        ],
        next_steps_if_achieved: 'Raise Series A to accelerate growth',
        next_steps_if_missed: 'Extend runway via bridge round, optimize operations'
      },
      {
        milestone: 'Series A Ready',
        timeline: 'Month 15-18',
        success_criteria: [
          '$1M+ ARR',
          '>15% MoM growth sustained',
          'Strong unit economics (LTV:CAC >5:1)',
          'Clear path to $10M ARR',
          'Experienced team in place'
        ],
        next_steps_if_achieved: 'Close $5-10M Series A, scale aggressively',
        next_steps_if_missed: 'Continue bootstrapped growth, aim for profitability'
      }
    ];
  }

  createDecisionFramework(analysis) {
    return {
      go_decision_criteria: {
        must_haves: [
          'Clear, validated customer pain point',
          'Viable path to $10M+ ARR',
          'Differentiated solution',
          'Founders have relevant expertise',
          'Can build MVP in <6 months'
        ],
        evaluation: 'All must-haves should be met to proceed confidently'
      },

      no_go_signals: [
        'Unable to validate problem exists after 20+ interviews',
        'Competitive landscape too crowded with no clear differentiator',
        'Market too small (<$100M TAM)',
        'CAC consistently >5x LTV',
        'Cannot recruit beta users despite outreach'
      ],

      pivot_triggers: [
        'Churn rate >10% monthly for 3+ months',
        'Unable to achieve $5K MRR in 9 months',
        'Consistent negative feedback on core value prop',
        'Market conditions change fundamentally',
        'Better opportunity identified'
      ],

      monthly_review_questions: [
        'Are we making progress toward key milestones?',
        'What did we learn this month?',
        'What metrics are trending in the right direction?',
        'What metrics are concerning?',
        'Do we need to pivot any part of the strategy?',
        'What blockers need to be addressed?'
      ]
    };
  }
}

module.exports = OverviewAgent;
