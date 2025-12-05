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

    return {
      market_analysis: this.analyzeMarket(trendData, conversationAnalysis),
      positioning: this.developPositioning(conversationAnalysis),
      messaging: this.craftMessaging(conversationAnalysis),
      go_to_market_strategy: this.planGTMStrategy(conversationAnalysis),
      content_strategy: this.planContentStrategy(conversationAnalysis),
      channel_recommendations: this.recommendChannels(conversationAnalysis),
      launch_plan: this.createLaunchPlan(conversationAnalysis)
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
}

module.exports = MarketingAgent;
