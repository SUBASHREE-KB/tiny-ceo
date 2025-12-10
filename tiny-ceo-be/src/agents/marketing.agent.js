const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');

/**
 * Marketing Agent
 * Handles market sizing, positioning, GTM strategy, and content marketing
 */
class MarketingAgent extends BaseAgent {
  constructor() {
    super(
      'Marketing',
      'Chief Marketing Officer & Growth Strategist',
      [
        'Market size estimation (TAM, SAM, SOM)',
        'Competitive positioning',
        'Go-to-market strategy',
        'Content marketing',
        'Brand positioning',
        'Channel strategy'
      ]
    );
  }

  async analyze(conversationAnalysis, options = {}) {
    logger.agent('Marketing', 'Starting marketing analysis');

    const aiService = require('../services/ai.service');

    try {
      const instructions = `Generate a comprehensive marketing analysis with the following JSON structure:
{
  "positioning": {
    "value_proposition": "string (clear, compelling value prop)",
    "target_message": "string (core marketing message)",
    "differentiation": ["string (key differentiators)"]
  },
  "market_analysis": {
    "tam": "string (total addressable market)",
    "sam": "string (serviceable addressable market)",
    "som": "string (serviceable obtainable market)",
    "market_trends": ["string (relevant trends)"]
  },
  "channels": [
    {
      "channel": "string (channel name)",
      "priority": "High|Medium|Low",
      "cost": "string (estimated monthly cost)",
      "expected_reach": "string",
      "tactics": ["string (specific tactics)"]
    }
  ],
  "messaging": {
    "headline": "string (main headline)",
    "tagline": "string",
    "elevator_pitch": "string (30-second pitch)",
    "key_benefits": ["string"]
  },
  "content_strategy": {
    "content_types": ["string (blog, video, etc.)"],
    "frequency": "string",
    "themes": ["string (content themes)"],
    "distribution": ["string (distribution channels)"]
  },
  "launch_plan": [
    {
      "phase": "string",
      "timeline": "string",
      "activities": ["string"],
      "goals": ["string"]
    }
  ]
}

Base your analysis on the actual product, target market, and competitive landscape. Provide specific marketing strategies for THIS startup.`;

      const insights = await aiService.generateAgentAnalysis('marketing', conversationAnalysis, instructions, options);

      if (insights.error) {
        logger.warn('Marketing AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis);
      }

      logger.agent('Marketing', 'Marketing analysis completed');
      return insights;
    } catch (error) {
      logger.error('Marketing analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis);
    }
  }

  async generateTemplateInsights(conversationAnalysis) {
    const trendData = await this.searchMarketTrends(conversationAnalysis.industry);

    // Generate AI-powered market intelligence for visualization data
    const marketIntelligence = await this.generateMarketIntelligence(conversationAnalysis);

    return {
      market_analysis: this.analyzeMarket(trendData, conversationAnalysis),
      positioning: this.developPositioning(conversationAnalysis),
      messaging: this.craftMessaging(conversationAnalysis),
      go_to_market_strategy: this.planGTMStrategy(conversationAnalysis),
      content_strategy: this.planContentStrategy(conversationAnalysis),
      channel_recommendations: this.recommendChannels(conversationAnalysis),
      launch_plan: this.createLaunchPlan(conversationAnalysis),
      // New: Visualization data powered by AI analysis
      market_trends_data: this.generateMarketTrendsData(conversationAnalysis, marketIntelligence),
      revenue_projections: this.generateRevenueProjections(conversationAnalysis, marketIntelligence),
      profit_analysis: this.generateProfitAnalysis(conversationAnalysis, marketIntelligence),
      customer_metrics: this.generateCustomerMetrics(conversationAnalysis, marketIntelligence),
      channel_performance: this.generateChannelPerformance(conversationAnalysis, marketIntelligence)
    };
  }

  analyzeMarket(trendData, analysis) {
    const { industry, targetAudience } = analysis;

    return {
      market_size: {
        tam: 'Total Addressable Market - $50B global market for ' + industry,
        sam: 'Serviceable Addressable Market - $5B (subset you can realistically reach)',
        som: 'Serviceable Obtainable Market - $250M (what you can capture in 3-5 years)',
        methodology: 'Top-down industry analysis + bottom-up customer count estimation',
        assumptions: [
          `Target customer: ${targetAudience}`,
          'Pricing at $58 ARPU',
          'Market penetration: 2-3% of addressable market by year 5'
        ]
      },
      target_segments: [
        {
          segment: 'Primary: Early Adopters in ' + industry,
          size: '~50,000 potential customers',
          characteristics: [
            'Tech-savvy, willing to try new tools',
            'Frustrated with current solutions',
            'Budget authority or strong influence',
            '10-100 employee companies'
          ],
          why_first: 'Fastest path to revenue, will provide testimonials, lower acquisition cost'
        },
        {
          segment: 'Secondary: Mainstream ' + targetAudience,
          size: '~500,000 potential customers',
          characteristics: [
            'More risk-averse, need social proof',
            'Larger budgets but longer sales cycles',
            'Require more features and integrations'
          ],
          when_to_target: 'After product-market fit with early adopters (6-12 months)'
        },
        {
          segment: 'Future: Enterprise Accounts',
          size: '~5,000 large companies',
          characteristics: [
            'Large budgets, multi-year contracts',
            'Complex procurement processes',
            'Require compliance, security, custom features'
          ],
          when_to_target: 'Year 2+ when you have proven product and resources'
        }
      ],
      market_trends: (trendData.trends || []).slice(0, 4).map(trend => ({
        trend: trend.trend || trend,
        impact: trend.impact || 'Medium',
        how_to_leverage: trend.opportunity || 'Position product to capitalize on this trend',
        timeline: trend.timeline || 'Current'
      })),
      competitive_landscape: {
        market_maturity: 'Growing - mix of established and emerging players',
        competition_intensity: 'Moderate to High',
        differentiation_opportunity: 'Strong - focus on niche, UX, and modern approach',
        barriers_to_entry: 'Medium - need technical expertise and capital for customer acquisition'
      }
    };
  }

  developPositioning(analysis) {
    const { targetAudience, problem, solution, uniqueValue } = analysis;

    return {
      positioning_statement: `For ${targetAudience} who struggle with ${problem}, our solution is ${solution} that ${uniqueValue}, unlike alternatives that are complex and outdated.`,

      value_propositions: [
        {
          proposition: uniqueValue,
          why_it_matters: 'Saves time and reduces errors compared to manual approaches',
          proof_point: 'Users report 10x faster workflows in beta testing'
        },
        {
          proposition: 'Modern, intuitive design',
          why_it_matters: 'No training required, faster adoption across teams',
          proof_point: 'Average onboarding time: <10 minutes'
        },
        {
          proposition: 'Built for ' + targetAudience,
          why_it_matters: 'Understands your specific workflow and needs',
          proof_point: 'Developed with input from 50+ target users'
        }
      ],

      differentiation: [
        {
          us: 'User-friendly, modern interface',
          them: 'Complex, outdated UI',
          benefit: 'Faster adoption, less training needed'
        },
        {
          us: 'Fast setup and onboarding',
          them: 'Lengthy implementation process',
          benefit: 'Time to value in minutes, not weeks'
        },
        {
          us: 'Transparent, simple pricing',
          them: 'Complex, enterprise pricing',
          benefit: 'Know exactly what you\'re paying for'
        },
        {
          us: 'Focused on core value',
          them: 'Feature bloat',
          benefit: 'Does one thing exceptionally well'
        }
      ],

      brand_personality: {
        voice: 'Friendly, helpful, professional',
        tone: 'Approachable but knowledgeable',
        characteristics: ['Modern', 'Trustworthy', 'Efficient', 'User-centric'],
        avoid: ['Overly technical jargon', 'Corporate speak', 'Hype and exaggeration']
      },

      elevator_pitch: `We help ${targetAudience} ${solution.toLowerCase()} through ${uniqueValue.toLowerCase()}. Think of us as the modern alternative to ${this.getTraditionalAlternative(analysis)} - simple, fast, and built for teams that value efficiency.`,

      one_liner: `${uniqueValue} for ${targetAudience}`
    };
  }

  craftMessaging(analysis) {
    const { solution, targetAudience, uniqueValue } = analysis;

    return {
      landing_page: {
        headline: this.generateHeadline(solution, uniqueValue),
        subheadline: `The modern solution for ${targetAudience} who want to work smarter, not harder`,
        cta_primary: 'Start Free 14-Day Trial',
        cta_secondary: 'Watch Demo (2 min)',
        social_proof: 'Join 500+ teams already saving 10+ hours per week',
        value_props: [
          'Set up in minutes, not days',
          'No credit card required for trial',
          'Cancel anytime, no contracts'
        ]
      },

      email_sequences: {
        welcome_series: [
          {
            email: 1,
            timing: 'Immediately after signup',
            subject: 'Welcome! Here\'s how to get started',
            goal: 'First activation, complete onboarding',
            content_outline: 'Welcome, explain core value, show quick start guide, CTA to first action'
          },
          {
            email: 2,
            timing: '24 hours later',
            subject: 'Quick tip: [Solve specific pain point]',
            goal: 'Show value, increase engagement',
            content_outline: 'Share one powerful feature, include use case, link to help docs'
          },
          {
            email: 3,
            timing: '3 days later',
            subject: 'How [Company] saved 15 hours/week',
            goal: 'Social proof, demonstrate ROI',
            content_outline: 'Customer success story, metrics, CTA to book demo'
          },
          {
            email: 4,
            timing: '7 days later',
            subject: 'Your trial ends in 7 days - here\'s what you might have missed',
            goal: 'Re-engage, show unused features',
            content_outline: 'Highlight unused features, offer help, conversion nudge'
          }
        ],
        conversion_series: [
          {
            email: 1,
            timing: 'Trial day 12 (2 days before end)',
            subject: 'Your trial ends soon - upgrade and save 20%',
            goal: 'Convert to paid',
            content_outline: 'Limited-time offer, ROI calculator, comparison chart, strong CTA'
          }
        ]
      },

      sales_messaging: {
        pain_questions: [
          `Are you frustrated with ${analysis.problem}?`,
          `How much time does your team spend on [manual process]?`,
          `What would it mean to your business to solve this problem?`
        ],
        value_statements: [
          `We help ${targetAudience} reduce [task] time by 80%`,
          `Our customers typically see ROI within 3 months`,
          `${uniqueValue} means you can finally [achieve goal]`
        ],
        objection_responses: {
          'too_expensive': 'Let\'s look at the ROI - if you save 10 hours/week at $50/hour, that\'s $2,000/month in value for $79/month',
          'need_to_think': 'I understand. What specific concerns do you have? Let\'s address those now.',
          'using_competitor': 'That\'s great you have a solution. What\'s working well? What\'s not? How can we complement or improve your current setup?',
          'not_right_time': 'When would be the right time? What needs to happen first? Can we help make that happen sooner?'
        }
      },

      key_messages: [
        'Save time with ' + uniqueValue,
        'Built specifically for ' + targetAudience,
        'Modern alternative to outdated solutions',
        'See results in days, not months',
        'Try free for 14 days, no credit card required'
      ]
    };
  }

  planGTMStrategy(analysis) {
    const { targetAudience, industry } = analysis;

    return {
      strategy_overview: 'Product-led growth with content marketing foundation and targeted paid acquisition',

      channel_mix: [
        {
          channel: 'Content Marketing & SEO',
          priority: 'High',
          budget_allocation: '25%',
          timeline: 'Start immediately, results in 3-6 months',
          tactics: [
            'Create 3-4 blog posts per week targeting buyer keywords',
            'Develop comprehensive guides and templates',
            'Guest post on industry publications',
            'Build backlinks through partnerships'
          ],
          expected_results: '150-200 qualified leads per month by month 6',
          ownership: 'Founder + contract writer'
        },
        {
          channel: 'Product-Led Growth',
          priority: 'High',
          budget_allocation: '10%',
          timeline: 'Launch with product',
          tactics: [
            '14-day free trial with no credit card',
            'Freemium tier for individuals',
            'In-app upgrade prompts at friction points',
            'Viral referral program (give $20, get $20)'
          ],
          expected_results: '15-20% trial-to-paid conversion',
          ownership: 'Product team'
        },
        {
          channel: 'Paid Advertising',
          priority: 'High',
          budget_allocation: '40%',
          timeline: 'Start month 2 after collecting data',
          tactics: [
            'Google Ads: Intent-based search campaigns',
            'LinkedIn Ads: Job title targeting for B2B',
            'Retargeting: Website visitors',
            'A/B test ad creative and landing pages'
          ],
          expected_results: '$150-250 CAC, 50-100 customers per month',
          ownership: 'Founder or agency'
        },
        {
          channel: 'Social Media & Community',
          priority: 'Medium',
          budget_allocation: '15%',
          timeline: 'Ongoing',
          tactics: [
            'LinkedIn: Share insights, engage in groups',
            'Twitter: Build founder brand, product updates',
            'Industry communities: Reddit, Slack groups, forums',
            'Host webinars and AMAs'
          ],
          expected_results: 'Brand awareness, 25-50 leads per month',
          ownership: 'Founder + community manager'
        },
        {
          channel: 'Partnerships & Integrations',
          priority: 'Medium',
          budget_allocation: '10%',
          timeline: 'Month 3+',
          tactics: [
            'Integration partnerships with complementary tools',
            'Co-marketing with non-competitive products',
            'Affiliate program for influencers',
            'Marketplace listings (if applicable)'
          ],
          expected_results: '10-20% of new customers from partners',
          ownership: 'Founder + partnerships lead'
        }
      ],

      launch_sequence: [
        {
          phase: 'Pre-Launch (-30 days)',
          goals: 'Build waitlist, create buzz',
          activities: [
            'Set up landing page with email capture',
            'Post on Product Hunt "upcoming"',
            'Share on social media, build anticipation',
            'Line up 10-15 beta testimonials'
          ]
        },
        {
          phase: 'Launch Week',
          goals: 'Maximum visibility',
          activities: [
            'Product Hunt launch (Tuesday-Thursday ideal)',
            'Post on Hacker News',
            'LinkedIn announcement',
            'Email waitlist',
            'Reach out to press and influencers'
          ]
        },
        {
          phase: 'Post-Launch (30 days)',
          goals: 'Sustain momentum, iterate',
          activities: [
            'Collect and share user testimonials',
            'Publish case studies',
            'Launch paid campaigns',
            'Optimize based on analytics'
          ]
        }
      ]
    };
  }

  planContentStrategy(analysis) {
    return {
      content_pillars: [
        {
          pillar: 'Education & How-To',
          purpose: 'Help audience solve problems, build trust',
          content_types: ['Blog posts', 'Video tutorials', 'Guides & templates'],
          frequency: '2-3 pieces per week',
          examples: [
            'How to [solve specific problem] in 5 steps',
            'The complete guide to [process]',
            'Common mistakes in [task] and how to avoid them'
          ]
        },
        {
          pillar: 'Product & Features',
          purpose: 'Showcase capabilities, drive trial signups',
          content_types: ['Feature announcements', 'Use cases', 'Demo videos'],
          frequency: '1 piece per week',
          examples: [
            'New feature: [Feature name] makes [task] 10x faster',
            '5 ways to use [Product] for [use case]',
            'Demo: See how [Company] saved 15 hours/week'
          ]
        },
        {
          pillar: 'Industry Insights',
          purpose: 'Establish thought leadership, attract decision-makers',
          content_types: ['Trend analyses', 'Research reports', 'Opinion pieces'],
          frequency: '1 piece per week',
          examples: [
            'State of [Industry] 2024: Key trends',
            'Why [trend] matters for [target audience]',
            'The future of [category]'
          ]
        },
        {
          pillar: 'Customer Success',
          purpose: 'Social proof, show real-world results',
          content_types: ['Case studies', 'Testimonials', 'User interviews'],
          frequency: '1 piece per 2 weeks',
          examples: [
            'How [Company] achieved [result] with [Product]',
            'Customer spotlight: [Customer name]',
            'Success metrics: [Impressive stat]'
          ]
        }
      ],

      distribution_strategy: {
        owned_channels: [
          'Blog on website',
          'Email newsletter (weekly)',
          'YouTube channel',
          'Podcast (later)'
        ],
        earned_channels: [
          'Guest posts on industry blogs',
          'Press coverage',
          'Influencer mentions',
          'Community shares'
        ],
        paid_channels: [
          'Promoted content on LinkedIn',
          'Sponsored newsletters',
          'Content syndication'
        ]
      },

      seo_strategy: {
        primary_keywords: this.generateKeywords(analysis),
        content_types_for_seo: [
          'Long-form guides (2,000+ words)',
          'Comparison posts ([Product] vs [Competitor])',
          'Alternative posts (Best [Competitor] alternatives)',
          'Tool/template pages'
        ],
        technical_seo: [
          'Fast page load speed (<2s)',
          'Mobile-responsive design',
          'Clear site structure with internal linking',
          'Schema markup for rich snippets'
        ]
      }
    };
  }

  recommendChannels(analysis) {
    return {
      top_3_channels: [
        {
          channel: 'SEO + Content Marketing',
          why: 'Long-term compounding returns, builds authority, lower CAC over time',
          investment: '25% of marketing budget',
          timeline: 'Results in 3-6 months'
        },
        {
          channel: 'Paid Search (Google Ads)',
          why: 'Intent-based, immediate results, predictable ROI',
          investment: '40% of marketing budget',
          timeline: 'Results immediate, optimize over 2-3 months'
        },
        {
          channel: 'Product-Led Growth',
          why: 'Self-serve trials convert well, viral potential, scalable',
          investment: '10% of marketing budget',
          timeline: 'Works from day one'
        }
      ],

      avoid_initially: [
        {
          channel: 'TV/Radio',
          why: 'Too expensive, hard to track, better for consumer brands'
        },
        {
          channel: 'Outbound Sales',
          why: 'High cost, slow, better after product-market fit'
        },
        {
          channel: 'Events/Conferences',
          why: 'Expensive, time-intensive, wait until more budget'
        }
      ]
    };
  }

  createLaunchPlan(analysis) {
    return {
      pre_launch: {
        timing: '30 days before',
        checklist: [
          'Landing page live with email capture',
          'Product Hunt profile created and "upcoming" posted',
          'Social media accounts set up and posting',
          'Beta users lined up for testimonials',
          'Press kit and materials prepared',
          'Analytics and tracking configured'
        ]
      },
      launch_day: {
        timing: 'Launch day (Tuesday-Thursday recommended)',
        checklist: [
          'Product Hunt launch at 12:01 AM PT',
          'Hacker News "Show HN" post',
          'Email blast to waitlist',
          'Social media announcements',
          'Personal network outreach',
          'Monitor and respond to comments/questions'
        ],
        goals: '#1-3 on Product Hunt, 500+ upvotes, 100+ trial signups'
      },
      post_launch: {
        timing: '30 days after',
        checklist: [
          'Collect and publish testimonials',
          'Write launch recap blog post',
          'Thank supporters publicly',
          'Start paid advertising campaigns',
          'Publish first case study',
          'Iterate based on feedback'
        ]
      }
    };
  }

  generateHeadline(solution, uniqueValue) {
    const templates = [
      `${uniqueValue} That Actually Works`,
      `The Smart Way to ${solution}`,
      `${solution}, Simplified`,
      `Finally, ${solution} That Doesn't Suck`,
      `${uniqueValue} in Minutes, Not Hours`
    ];

    return templates[0];
  }

  getTraditionalAlternative(analysis) {
    const lowerText = analysis.fullText.toLowerCase();

    if (lowerText.includes('spreadsheet')) return 'spreadsheets and manual processes';
    if (lowerText.includes('email')) return 'email and scattered tools';
    return 'traditional, complex software';
  }

  generateKeywords(analysis) {
    const { industry, problem, solution } = analysis;

    return [
      `${industry} software`,
      `how to ${problem.toLowerCase()}`,
      `${solution.toLowerCase()} tool`,
      `best ${industry} platform`,
      `${industry} automation`,
      `alternative to [competitor name]`,
      `${industry} for small business`
    ];
  }

  // Generate AI-powered market intelligence specific to the startup idea
  async generateMarketIntelligence(conversationAnalysis) {
    const aiService = require('../services/ai.service');

    try {
      const prompt = `Analyze the market for this startup and provide realistic data:

Startup Context:
- Industry: ${conversationAnalysis.industry}
- Target Audience: ${conversationAnalysis.targetAudience}
- Problem: ${conversationAnalysis.problem}
- Solution: ${conversationAnalysis.solution}
- Business Model: ${conversationAnalysis.businessModel}

Provide a JSON response with realistic market intelligence:
{
  "market_size": {
    "tam_value": number (in USD, total addressable market globally),
    "sam_value": number (in USD, serviceable available market),
    "som_value": number (in USD, serviceable obtainable market in 3 years),
    "growth_rate_annual": number (e.g., 0.18 for 18% CAGR)
  },
  "revenue_model": {
    "initial_mrr": number (realistic starting monthly recurring revenue in first month),
    "average_customer_value": number (average revenue per customer per month),
    "monthly_growth_rate": number (e.g., 0.15 for 15% MoM growth),
    "customer_acquisition_rate": number (new customers per month initially)
  },
  "costs": {
    "initial_funding": number (typical seed funding for this type of startup),
    "monthly_burn_rate": number (monthly expenses),
    "cogs_percentage": number (0.20 for 20% of revenue),
    "marketing_percentage": number (0.25 for 25% of revenue)
  },
  "customer_metrics": {
    "initial_cac": number (customer acquisition cost),
    "ltv": number (lifetime value per customer),
    "monthly_churn_rate": number (e.g., 0.05 for 5% churn)
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
      logger.info('Market intelligence generated via AI', { industry: conversationAnalysis.industry });
      return intelligence;
    } catch (error) {
      logger.warn('AI market intelligence failed, using educated estimates', error);
      // Fallback to educated estimates based on industry
      return this.generateFallbackIntelligence(conversationAnalysis);
    }
  }

  // Fallback intelligence based on industry patterns
  generateFallbackIntelligence(conversationAnalysis) {
    const industryDefaults = {
      'SaaS': {
        tam_value: 50000000000, // $50B
        growth_rate_annual: 0.18,
        initial_mrr: 5000,
        monthly_growth_rate: 0.15,
        initial_cac: 150,
        ltv: 1200
      },
      'E-commerce': {
        tam_value: 100000000000,
        growth_rate_annual: 0.15,
        initial_mrr: 8000,
        monthly_growth_rate: 0.20,
        initial_cac: 80,
        ltv: 800
      },
      'Fintech': {
        tam_value: 75000000000,
        growth_rate_annual: 0.22,
        initial_mrr: 6000,
        monthly_growth_rate: 0.18,
        initial_cac: 200,
        ltv: 1500
      },
      'Healthcare': {
        tam_value: 120000000000,
        growth_rate_annual: 0.14,
        initial_mrr: 10000,
        monthly_growth_rate: 0.12,
        initial_cac: 300,
        ltv: 2000
      }
    };

    const defaults = industryDefaults[conversationAnalysis.industry] || industryDefaults['SaaS'];

    return {
      market_size: {
        tam_value: defaults.tam_value,
        sam_value: defaults.tam_value * 0.15,
        som_value: defaults.tam_value * 0.01,
        growth_rate_annual: defaults.growth_rate_annual
      },
      revenue_model: {
        initial_mrr: defaults.initial_mrr,
        average_customer_value: 50,
        monthly_growth_rate: defaults.monthly_growth_rate,
        customer_acquisition_rate: Math.round(defaults.initial_mrr / 50)
      },
      costs: {
        initial_funding: 750000,
        monthly_burn_rate: 35000,
        cogs_percentage: 0.20,
        marketing_percentage: 0.25
      },
      customer_metrics: {
        initial_cac: defaults.initial_cac,
        ltv: defaults.ltv,
        monthly_churn_rate: 0.05
      }
    };
  }

  // Generate market trends data for visualization
  generateMarketTrendsData(analysis, marketIntelligence) {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Use AI-generated market size and growth rate
    const baseMarketSize = marketIntelligence.market_size.tam_value;
    const annualGrowthRate = marketIntelligence.market_size.growth_rate_annual;
    const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1/12) - 1;

    // Generate historical data (last 12 months) and projections (next 12 months)
    const data = [];

    for (let i = -12; i <= 12; i++) {
      const monthIndex = (new Date().getMonth() + i + 12) % 12;
      const yearOffset = Math.floor((new Date().getMonth() + i) / 12);

      // Realistic market growth with seasonal variance
      const variance = (Math.sin(i * 0.5) * 0.003); // Small seasonal variance
      const marketSize = baseMarketSize * Math.pow(1 + monthlyGrowthRate + variance, i);

      // Your potential market share growth (starts from launch, grows gradually)
      const yourShareBase = i < 0 ? 0 : (i * 0.0015); // Grow to ~1.8% over 12 months
      const yourMarketSize = marketSize * yourShareBase;

      data.push({
        month: months[monthIndex],
        year: currentYear + yearOffset,
        total_market: Math.round(marketSize / 1000000), // Convert to millions
        your_market: Math.round(yourMarketSize / 1000000),
        growth_rate: ((monthlyGrowthRate + variance) * 100).toFixed(2),
        is_projection: i > 0
      });
    }

    // Calculate dynamic summary based on AI data
    const currentMarketSize = baseMarketSize / 1000000000; // In billions
    const finalSharePercentage = (data[data.length - 1].your_market / data[data.length - 1].total_market * 100).toFixed(1);

    return {
      historical_and_projected: data,
      summary: {
        current_market_size: `$${currentMarketSize.toFixed(1)}B`,
        projected_growth_rate: `${(annualGrowthRate * 100).toFixed(0)}% CAGR`,
        your_projected_share: `${finalSharePercentage}% by year end`,
        market_maturity: annualGrowthRate > 0.15 ? 'High Growth' : annualGrowthRate > 0.08 ? 'Growth Stage' : 'Mature'
      }
    };
  }

  // Generate revenue projections
  generateRevenueProjections(analysis, marketIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    let cumulativeRevenue = 0;

    // Use AI-generated values
    const baseRevenue = marketIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = marketIntelligence.revenue_model.monthly_growth_rate;
    const cogsPercentage = marketIntelligence.costs.cogs_percentage;

    for (let i = 0; i < 12; i++) {
      // Growth curve based on AI-generated monthly growth rate
      const growthFactor = Math.pow(1 + monthlyGrowthRate, i);
      const monthlyRevenue = Math.round(baseRevenue * growthFactor);

      cumulativeRevenue += monthlyRevenue;

      // Calculate costs using AI-generated percentages
      const costs = Math.round(monthlyRevenue * cogsPercentage);
      const profit = monthlyRevenue - costs;

      data.push({
        month: months[i],
        revenue: monthlyRevenue,
        costs: costs,
        profit: profit,
        cumulative_revenue: cumulativeRevenue,
        profit_margin: ((profit / monthlyRevenue) * 100).toFixed(1)
      });
    }

    return {
      monthly_data: data,
      year_end_projection: {
        total_revenue: cumulativeRevenue,
        average_monthly_revenue: Math.round(cumulativeRevenue / 12),
        final_mrr: data[11].revenue,
        arr_projection: data[11].revenue * 12
      }
    };
  }

  // Generate profit analysis data
  generateProfitAnalysis(analysis, marketIntelligence) {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const data = [];

    // Use AI-generated values
    const initialMRR = marketIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = marketIntelligence.revenue_model.monthly_growth_rate;
    const cogsPercentage = marketIntelligence.costs.cogs_percentage;
    const marketingPercentage = marketIntelligence.costs.marketing_percentage;
    const monthlyBurnRate = marketIntelligence.costs.monthly_burn_rate;

    for (let i = 0; i < 4; i++) {
      // Calculate quarterly revenue (sum of 3 months)
      let quarterlyRevenue = 0;
      for (let month = 0; month < 3; month++) {
        const monthIndex = i * 3 + month;
        quarterlyRevenue += Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, monthIndex));
      }

      const cogs = Math.round(quarterlyRevenue * cogsPercentage);
      const marketing = Math.round(quarterlyRevenue * marketingPercentage);
      const operations = monthlyBurnRate * 3; // 3 months of burn
      const grossProfit = quarterlyRevenue - cogs;
      const netProfit = quarterlyRevenue - cogs - marketing - operations;

      data.push({
        quarter: quarters[i],
        revenue: quarterlyRevenue,
        cogs: cogs,
        marketing: marketing,
        operations: operations,
        gross_profit: grossProfit,
        net_profit: netProfit,
        gross_margin: ((grossProfit / quarterlyRevenue) * 100).toFixed(1),
        net_margin: ((netProfit / quarterlyRevenue) * 100).toFixed(1)
      });
    }

    // Calculate break-even month
    let breakEvenMonth = 12;
    let cumulativeProfit = 0;
    for (let i = 0; i < 12; i++) {
      const monthRevenue = Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, i));
      const monthProfit = monthRevenue - Math.round(monthRevenue * cogsPercentage) - Math.round(monthRevenue * marketingPercentage) - monthlyBurnRate;
      cumulativeProfit += monthProfit;
      if (cumulativeProfit > 0 && breakEvenMonth === 12) {
        breakEvenMonth = i + 1;
      }
    }

    return {
      quarterly_data: data,
      break_even_month: breakEvenMonth,
      profitability_metrics: {
        target_gross_margin: `${((1 - cogsPercentage) * 100).toFixed(0)}%`,
        target_net_margin: `${((1 - cogsPercentage - marketingPercentage - 0.15) * 100).toFixed(0)}%`,
        current_burn_rate: `$${monthlyBurnRate.toLocaleString()}/month`,
        runway: `${Math.round(marketIntelligence.costs.initial_funding / monthlyBurnRate)} months`
      }
    };
  }

  // Generate customer acquisition metrics
  generateCustomerMetrics(analysis, marketIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    // Use AI-generated values
    const initialAcquisitionRate = marketIntelligence.revenue_model.customer_acquisition_rate;
    const monthlyChurnRate = marketIntelligence.customer_metrics.monthly_churn_rate;
    const initialCAC = marketIntelligence.customer_metrics.initial_cac;
    const initialLTV = marketIntelligence.customer_metrics.ltv;
    const monthlyGrowthRate = marketIntelligence.revenue_model.monthly_growth_rate;

    let totalCustomers = 0;

    for (let i = 0; i < 12; i++) {
      // Customer acquisition grows with the same rate as revenue
      const newCustomers = Math.round(initialAcquisitionRate * Math.pow(1 + monthlyGrowthRate, i));
      totalCustomers += newCustomers;

      // Churn after month 2 as customer base grows
      const churnedCustomers = i > 2 ? Math.round(totalCustomers * monthlyChurnRate) : 0;
      totalCustomers -= churnedCustomers;

      // CAC decreases as you optimize (5% improvement per month)
      const cac = Math.round(initialCAC * Math.pow(0.95, i));

      // LTV increases as you add features and reduce churn
      const ltv = Math.round(initialLTV * Math.pow(1.03, i)); // 3% improvement per month

      data.push({
        month: months[i],
        new_customers: newCustomers,
        churned_customers: churnedCustomers,
        total_customers: totalCustomers,
        cac: cac,
        ltv: ltv,
        ltv_cac_ratio: (ltv / cac).toFixed(2),
        churn_rate: totalCustomers > 0 ? ((churnedCustomers / totalCustomers) * 100).toFixed(2) : '0.00'
      });
    }

    const paybackPeriod = Math.round(data[11].cac / (data[11].ltv / 12));

    return {
      monthly_data: data,
      key_metrics: {
        current_cac: data[11].cac,
        current_ltv: data[11].ltv,
        ltv_cac_ratio: data[11].ltv_cac_ratio,
        total_customers: data[11].total_customers,
        monthly_churn: `${(monthlyChurnRate * 100).toFixed(1)}%`,
        payback_period: `${paybackPeriod} months`
      }
    };
  }

  // Generate channel performance data
  generateChannelPerformance(analysis, marketIntelligence) {
    // Use AI-generated values
    const totalMonthlyBudget = marketIntelligence.costs.monthly_burn_rate * marketIntelligence.costs.marketing_percentage / 0.35; // Adjust for full marketing budget
    const avgCustomerValue = marketIntelligence.revenue_model.average_customer_value;

    // Distribute budget across channels with typical allocation
    const channels = [
      { name: 'Paid Search', allocation: 0.40, conversionRate: 0.14, cacMultiplier: 1.0 },
      { name: 'Content/SEO', allocation: 0.25, conversionRate: 0.156, cacMultiplier: 1.01 },
      { name: 'Social Media', allocation: 0.15, conversionRate: 0.126, cacMultiplier: 1.45 },
      { name: 'Email Marketing', allocation: 0.10, conversionRate: 0.157, cacMultiplier: 0.51 },
      { name: 'Partnerships', allocation: 0.10, conversionRate: 0.178, cacMultiplier: 1.17 }
    ];

    const channelData = channels.map(channel => {
      const budget = Math.round(totalMonthlyBudget * channel.allocation);
      const spend = Math.round(budget * 0.9); // 90% spend rate
      const cac = Math.round(marketIntelligence.customer_metrics.initial_cac * channel.cacMultiplier);
      const customers = Math.round(spend / cac);
      const leads = Math.round(customers / channel.conversionRate);
      const revenue = customers * avgCustomerValue;
      const roi = Math.round((revenue / spend) * 100);

      return {
        name: channel.name,
        budget,
        spend,
        leads,
        customers,
        revenue,
        roi,
        cac,
        conversion_rate: (channel.conversionRate * 100).toFixed(1)
      };
    });

    // Calculate totals
    const totals = channelData.reduce((acc, channel) => ({
      budget: acc.budget + channel.budget,
      spend: acc.spend + channel.spend,
      leads: acc.leads + channel.leads,
      customers: acc.customers + channel.customers,
      revenue: acc.revenue + channel.revenue
    }), { budget: 0, spend: 0, leads: 0, customers: 0, revenue: 0 });

    return {
      channels: channelData,
      total_budget: totals.budget,
      total_spend: totals.spend,
      total_leads: totals.leads,
      total_customers: totals.customers,
      total_revenue: totals.revenue,
      overall_roi: Math.round((totals.revenue / totals.spend) * 100)
    };
  }
}

module.exports = MarketingAgent;
