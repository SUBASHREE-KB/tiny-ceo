const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');

/**
 * Sales Agent
 * Handles ICP definition, lead generation, sales playbook, and revenue operations
 */
class SalesAgent extends BaseAgent {
  constructor() {
    super(
      'Sales',
      'Chief Revenue Officer & Sales Strategist',
      [
        'Ideal Customer Profile (ICP) definition',
        'Lead generation strategy',
        'Sales playbook creation',
        'Objection handling',
        'Sales metrics and forecasting',
        'Sales process optimization'
      ]
    );
  }

  async analyze(conversationAnalysis, options = {}) {
    logger.agent('Sales', 'Starting sales analysis');

    const aiService = require('../services/ai.service');

    try {
      // Use Gemini AI to generate sales insights
      const instructions = `Generate a comprehensive sales strategy analysis with the following JSON structure:
{
  "icp": {
    "role": "string (decision maker role)",
    "company_size": "string",
    "industry": "string",
    "pain_points": ["string"],
    "budget": "string"
  },
  "buyer_persona": {
    "title": "string",
    "responsibilities": "string",
    "goals": ["string"],
    "challenges": ["string"]
  },
  "lead_gen": [
    {
      "source": "string (lead source name)",
      "priority": "High|Medium|Low",
      "conversion": "string (expected conversion rate)",
      "cost": "string (cost per lead)",
      "volume": "string (monthly volume)"
    }
  ],
  "playbook": [
    {
      "step": number,
      "action": "string",
      "description": "string",
      "timeline": "string"
    }
  ],
  "objection_handling": [
    {
      "objection": "string",
      "response": "string",
      "frequency": "Common|Occasional|Rare"
    }
  ],
  "sales_metrics": {
    "quota": "string (monthly quota)",
    "pipeline": "string (pipeline target)",
    "conversion": "string (target conversion rate)",
    "deal_size": "string (average deal size)",
    "cycle_length": "string (sales cycle length)"
  }
}

Base your analysis on the actual startup idea, target audience, and solution. Provide specific, actionable sales strategies tailored to THIS startup.`;

      const insights = await aiService.generateAgentAnalysis('sales', conversationAnalysis, instructions, options);

      // Fallback to template if AI fails
      if (insights.error) {
        logger.warn('Sales AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis);
      }

      logger.agent('Sales', 'Sales analysis completed');
      return insights;
    } catch (error) {
      logger.error('Sales analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis);
    }
  }

  generateTemplateInsights(conversationAnalysis) {
    // Fallback template insights
    return {
      icp: this.defineICP(conversationAnalysis),
      buyer_persona: this.createBuyerPersona(conversationAnalysis),
      lead_gen: this.planLeadGeneration(conversationAnalysis),
      playbook: this.createSalesPlaybook(conversationAnalysis),
      objection_handling: this.createObjectionHandling(conversationAnalysis),
      sales_metrics: this.defineSalesMetrics(conversationAnalysis)
    };
  }

  defineICP(analysis) {
    const { industry, targetAudience } = analysis;

    return {
      title: `Ideal Customer Profile for ${industry} Solution`,

      company_profile: {
        company_size: '10-500 employees',
        annual_revenue: '$1M - $50M',
        industry: industry,
        location: 'United States (expand to Canada, UK later)',
        type: 'B2B services, SaaS companies, fast-growing startups',
        tech_stack: 'Uses modern cloud tools, values automation and efficiency',
        growth_stage: 'Series A to Series B, growing 20%+ YoY'
      },

      firmographics: {
        employee_count: '10-500 (sweet spot: 25-100)',
        budget: '$5K-$50K annual software budget',
        decision_process: 'Manager recommends, Director/VP approves',
        buying_cycle: '30-90 days from first contact to close',
        contract_length: 'Annual preferred, monthly available'
      },

      technographics: {
        current_tools: 'Using legacy software or manual processes',
        tech_savviness: 'Medium to high - comfortable adopting new tools',
        integration_needs: 'Needs to integrate with Slack, Google Workspace, CRM',
        infrastructure: 'Cloud-first, remote or hybrid team'
      },

      behavioral_indicators: [
        'Recently raised funding (indicates budget and growth)',
        'Posting jobs for operations/growth roles',
        'Active on LinkedIn about scaling challenges',
        'Recently expanded to new market or product line',
        'Attended industry conferences (indicates investment in growth)'
      ],

      red_flags: [
        'Company is downsizing or laying off staff',
        'No clear decision-maker or budget owner',
        'Still using completely manual processes (change-averse)',
        'Very price-sensitive with no clear ROI understanding',
        'Unrealistic expectations or feature demands'
      ],

      qualification_criteria: {
        must_have: [
          'Experiences the core problem we solve',
          'Has budget or can allocate budget',
          'Decision-maker engaged or accessible',
          'Timeline to implement (not just exploring)'
        ],
        nice_to_have: [
          'Currently using competitor (easier to show value)',
          'Growing rapidly (urgent need)',
          'Part of our network (warm intro)',
          'Good brand/logo for case studies'
        ]
      }
    };
  }

  createBuyerPersona(analysis) {
    const { targetAudience, problem } = analysis;

    return {
      primary_persona: {
        title: 'Operations Manager / Head of Operations',
        level: 'Manager to Director level',
        department: 'Operations, Product Ops, or Revenue Ops',
        age: '28-45',
        experience: '5-15 years in operations or related field',

        demographics: {
          education: 'Bachelor\'s degree, often in Business or related field',
          location: 'Major US cities, remote-friendly companies',
          team_size: 'Manages 2-10 people'
        },

        day_in_life: [
          '8am: Review team performance dashboards',
          '9am: Team standup, address blockers',
          '10am: Meetings with other department heads',
          '2pm: Work on process improvements',
          '4pm: Report to leadership on metrics',
          '5pm: Research tools to improve efficiency'
        ],

        pain_points: [
          analysis.problem,
          'Spending too much time on manual, repetitive tasks',
          'Lack of visibility into team performance',
          'Difficulty scaling processes as company grows',
          'Limited budget but high expectations from leadership',
          'Team constantly asking for better tools'
        ],

        goals: {
          professional: [
            'Increase team efficiency by 30%+',
            'Reduce operational costs',
            'Implement scalable systems',
            'Get promoted to Senior Director/VP',
            'Make data-driven decisions'
          ],
          personal: [
            'Work-life balance (less firefighting)',
            'Be seen as strategic, not just tactical',
            'Build a reputation as an innovator'
          ]
        },

        buying_triggers: [
          'Team is overwhelmed, can\'t keep up with growth',
          'Leadership asking for better metrics/reporting',
          'New budget cycle starting',
          'Competitor mentioned using modern tools',
          'Recent funding round (budget available)'
        ],

        information_sources: [
          'LinkedIn (follows ops thought leaders)',
          'Industry newsletters and blogs',
          'Peer recommendations in Slack communities',
          'G2, Capterra reviews',
          'Podcasts during commute'
        ],

        objections: [
          '"We\'re already using [competitor]"',
          '"Not sure we have budget this quarter"',
          '"Need to get buy-in from [other stakeholder]"',
          '"Can we start with a pilot/proof of concept?"',
          '"What if it doesn\'t work for our use case?"'
        ]
      },

      secondary_persona: {
        title: 'VP of Operations / COO',
        level: 'Executive',
        role: 'Decision-maker or strong influencer',
        concerns: [
          'Strategic fit with company goals',
          'ROI and business case',
          'Vendor reliability and support',
          'Integration with existing systems',
          'Scalability as company grows'
        ]
      }
    };
  }

  planLeadGeneration(analysis) {
    return {
      lead_sources: [
        {
          source: 'Inbound Content Marketing',
          priority: 'High',
          monthly_leads: '150-200 MQLs',
          cost_per_lead: '$25-40',
          conversion_rate: '5-8% to SQL',
          tactics: [
            'SEO-optimized blog posts targeting buyer keywords',
            'Downloadable guides and templates (gated content)',
            'Educational webinars',
            'Industry reports and surveys'
          ],
          ownership: 'Marketing team',
          timeline: 'Ongoing, ramps up over 3-6 months'
        },
        {
          source: 'Product-Led Growth (Free Trial)',
          priority: 'High',
          monthly_leads: '100-150 signups',
          cost_per_lead: '$15-25',
          conversion_rate: '15-20% to paid',
          tactics: [
            '14-day free trial, no credit card',
            'In-app messaging for high-intent users',
            'Automated nurture sequences',
            'Usage-based triggers for sales outreach'
          ],
          ownership: 'Product + Sales',
          timeline: 'From launch'
        },
        {
          source: 'Paid Advertising (Google Ads, LinkedIn)',
          priority: 'High',
          monthly_leads: '75-125 MQLs',
          cost_per_lead: '$80-150',
          conversion_rate: '10-12% to SQL',
          tactics: [
            'Google Ads: Intent-based search campaigns',
            'LinkedIn Ads: Job title + company size targeting',
            'Retargeting: Website visitors',
            'A/B testing ad creative monthly'
          ],
          ownership: 'Marketing or agency',
          timeline: 'Start month 2'
        },
        {
          source: 'LinkedIn Outbound',
          priority: 'Medium',
          monthly_leads: '50-75 SQLs',
          cost_per_lead: '$60-100',
          conversion_rate: '8-12% to opportunity',
          tactics: [
            'Personalized connection requests',
            'Value-first messaging (no hard pitch)',
            'Multi-touch sequences (5-7 touchpoints)',
            'Target lookalike companies'
          ],
          ownership: 'Sales team or SDR',
          timeline: 'Start month 3'
        },
        {
          source: 'Partnerships & Referrals',
          priority: 'Medium',
          monthly_leads: '25-50 SQLs',
          cost_per_lead: '$30-50',
          conversion_rate: '20-25% to customer',
          tactics: [
            'Integration partnerships',
            'Customer referral program (incentivized)',
            'Affiliate program',
            'Co-marketing with complementary tools'
          ],
          ownership: 'Partnerships lead',
          timeline: 'Month 4+'
        }
      ],

      lead_qualification: {
        framework: 'BANT (Budget, Authority, Need, Timeline)',
        mql_criteria: [
          'Fits ICP (company size, industry)',
          'Engaged with content (3+ page views or downloaded resource)',
          'Provided business email (not personal)'
        ],
        sql_criteria: [
          'Confirmed budget or budget authority',
          'Has the problem we solve',
          'Timeline to purchase (within 90 days)',
          'Decision-maker involved or accessible'
        ],
        disqualification: [
          'Outside ICP (too small, wrong industry)',
          'No budget or timeline',
          'Just doing research, no intent',
          'Wants features we don\'t offer and won\'t build'
        ]
      },

      lead_routing: {
        hot_leads: 'Response within 5 minutes, assign to senior AE',
        warm_leads: 'Response within 2 hours, round-robin to AEs',
        cold_leads: 'Add to nurture sequence, revisit monthly'
      }
    };
  }

  createSalesPlaybook(analysis) {
    return {
      sales_methodology: 'Consultative selling with MEDDIC qualification',

      sales_stages: [
        {
          stage: 'Prospecting & Lead Qualification',
          goal: 'Identify and qualify potential customers',
          key_activities: [
            'Research company and persona',
            'Personalize outreach message',
            'Initial BANT qualification',
            'Book discovery call'
          ],
          exit_criteria: 'Discovery call scheduled with decision-maker or strong influencer',
          typical_duration: '1-7 days',
          conversion_rate: '30% of MQLs to discovery call'
        },
        {
          stage: 'Discovery Call',
          goal: 'Understand needs, build rapport, qualify further',
          key_activities: [
            'Ask open-ended questions about pain points',
            'Understand current process and challenges',
            'Identify budget and decision process',
            'Discuss timeline and next steps',
            'Book demo if qualified'
          ],
          questions_to_ask: [
            'Walk me through your current process for [task]',
            'What\'s working well? What\'s frustrating?',
            'What would success look like for you?',
            'Who else is involved in this decision?',
            'What\'s your timeline for making a decision?',
            'Have you allocated budget for this?'
          ],
          exit_criteria: 'Qualified need + demo scheduled',
          typical_duration: '15-20 minutes',
          conversion_rate: '60% to demo'
        },
        {
          stage: 'Product Demo',
          goal: 'Show how product solves their specific problems',
          key_activities: [
            'Customize demo to their use case',
            'Focus on outcomes, not just features',
            'Handle questions and objections',
            'Get verbal commitment to trial',
            'Set up trial account'
          ],
          demo_structure: [
            '(2 min) Recap their challenges from discovery',
            '(15 min) Show product solving those challenges',
            '(8 min) Address questions and concerns',
            '(5 min) Next steps: trial setup and check-in schedule'
          ],
          exit_criteria: 'Trial activated + onboarding scheduled',
          typical_duration: '30 minutes',
          conversion_rate: '70% to active trial'
        },
        {
          stage: 'Free Trial + Evaluation',
          goal: 'Drive activation and ongoing engagement',
          key_activities: [
            'Onboarding call/email within 24 hours',
            'Check-in at days 3, 7, 10',
            'Monitor usage and send tips',
            'Address questions/blockers immediately',
            'Schedule close call before trial ends'
          ],
          success_metrics: [
            'User logs in 5+ times during trial',
            'Completes key activation events',
            'Invites team members',
            'Positive sentiment in check-ins'
          ],
          exit_criteria: 'Trial success + close call scheduled',
          typical_duration: '14 days',
          conversion_rate: '20-25% to paid'
        },
        {
          stage: 'Proposal & Negotiation',
          goal: 'Present pricing, handle objections, close deal',
          key_activities: [
            'Send proposal with clear pricing',
            'Address pricing objections',
            'Negotiate terms if needed',
            'Get contract signed',
            'Process payment'
          ],
          proposal_elements: [
            'Recap of their challenges and goals',
            'Recommended plan and pricing',
            'ROI calculation',
            'Implementation timeline',
            'Terms and next steps'
          ],
          exit_criteria: 'Contract signed + payment processed',
          typical_duration: '3-7 days',
          conversion_rate: '50% of proposals to closed-won'
        },
        {
          stage: 'Onboarding & Expansion',
          goal: 'Ensure success and identify upsell opportunities',
          key_activities: [
            'Kickoff call with CSM',
            'Complete setup and configuration',
            'Training for team',
            '30-60-90 day check-ins',
            'Identify expansion opportunities'
          ],
          success_metrics: [
            'Time to first value < 7 days',
            'User adoption >80% of seats',
            'NPS >8',
            'Expansion revenue within 6 months'
          ],
          exit_criteria: 'Customer successful + upsell pipeline',
          typical_duration: '30-90 days',
          conversion_rate: '25% upgrade in first 6 months'
        }
      ],

      sales_scripts: {
        cold_outreach: 'Hi [Name], I noticed [Company] is [growing/hiring/expanding]. Many [similar companies] struggle with [problem]. We help teams like yours [outcome]. Would a 15-min call next week make sense to explore if we can help?',

        discovery_opening: 'Thanks for taking the time. I\'d love to learn more about [Company] and understand if we might be a fit. Can you start by telling me about your current [process/challenge]?',

        demo_opening: 'Based on our last conversation, I understand your main challenge is [problem]. Let me show you exactly how we help teams like yours solve this...',

        trial_check_in: 'Hey [Name], just checking in on your trial. How has your experience been so far? Any questions or roadblocks I can help with?',

        closing: 'It sounds like [Product] solves your key challenges around [problems]. Ready to move forward with the [plan] at [price]? I can get you set up today.'
      }
    };
  }

  createObjectionHandling(analysis) {
    return [
      {
        objection: '"It\'s too expensive"',
        root_cause: 'Don\'t see the value or ROI',
        response: 'I understand budget is important. Let\'s look at the ROI - if this saves your team even 5 hours per week, that\'s worth [calculate $]. The investment pays for itself in less than a month. Plus, we have a 14-day money-back guarantee.',
        follow_up: 'What\'s your current cost of doing this manually? (time + errors)'
      },
      {
        objection: '"We\'re already using [Competitor]"',
        root_cause: 'Happy with current solution or switching cost concern',
        response: 'That\'s great you have a solution! What\'s working well with [Competitor]? [Listen] And what would you improve if you could? [Our differentiators]. Many of our happiest customers switched from [Competitor] because [specific reason].',
        follow_up: 'Would you be open to a side-by-side comparison over a 2-week trial?'
      },
      {
        objection: '"I need to think about it"',
        root_cause: 'Unclear on value, risk-averse, or not decision-maker',
        response: 'Of course, this is an important decision. To make sure I\'m giving you everything you need - what specific concerns do you have? [Uncover real objection] Let\'s address those now so you have all the information.',
        follow_up: 'What would need to be true for this to be a no-brainer yes?'
      },
      {
        objection: '"Can we start next quarter?"',
        root_cause: 'Not urgent, budget timing, or avoiding decision',
        response: 'I understand timing is important. Help me understand - what\'s happening next quarter that\'s different? [Listen] The challenge is, every month you wait costs you [calculate ROI]. Plus, we\'re offering [incentive] for customers who start this month.',
        follow_up: 'What if we did a pilot this quarter to prove value before the full rollout?'
      },
      {
        objection: '"I need to get buy-in from [stakeholder]"',
        root_cause: 'Not the sole decision-maker',
        response: 'That makes sense - [stakeholder] should definitely be involved. What are their main concerns likely to be? [Listen] I\'d love to help you make the case to them. Can we set up a quick call with them, or would you prefer I send you a one-pager you can share?',
        follow_up: 'What criteria will they use to evaluate this?'
      },
      {
        objection: '"We\'re not sure it will work for our specific use case"',
        root_cause: 'Lack of confidence, need proof',
        response: 'I appreciate you being thoughtful about fit. We actually work with several companies in [their industry/situation]. For example, [Customer name] had a similar use case and saw [results]. The best way to know is to try it - would a 14-day trial with my personal support help you validate?',
        follow_up: 'What would you need to see during a trial to feel confident?'
      },
      {
        objection: '"We want to build this ourselves"',
        root_cause: 'Engineer-led company, NIH syndrome',
        response: 'I respect that - you clearly have strong technical talent. The question is: is this the best use of your engineering time vs building core product features? Our customers found they could deploy our solution in days vs 6+ months of dev time. Plus, you get ongoing updates and support.',
        follow_up: 'What would your team build instead if they didn\'t build this?'
      }
    ];
  }

  defineSalesMetrics(analysis) {
    return {
      key_metrics: [
        {
          metric: 'Sales Cycle Length',
          definition: 'Average days from first contact to closed-won',
          target: '30-45 days',
          why_it_matters: 'Shorter cycles mean faster revenue and more efficient sales team'
        },
        {
          metric: 'Win Rate',
          definition: 'Percentage of qualified opportunities that close',
          target: '25-30%',
          why_it_matters: 'Indicates product-market fit and sales effectiveness'
        },
        {
          metric: 'Average Deal Size (ACV)',
          definition: 'Average annual contract value',
          target: '$1,800/year (Starter + Professional mix)',
          why_it_matters: 'Determines how many customers needed to hit revenue goals'
        },
        {
          metric: 'Sales Velocity',
          definition: 'Rate of revenue generation',
          target: 'Increasing 10%+ monthly',
          formula: '(# opportunities × win rate × ACV) / sales cycle length',
          why_it_matters: 'Overall measure of sales efficiency and momentum'
        },
        {
          metric: 'Lead-to-Customer Conversion',
          definition: 'Percentage of MQLs that become customers',
          target: '2-5%',
          why_it_matters: 'Measures quality of marketing and sales alignment'
        },
        {
          metric: 'Trial-to-Paid Conversion',
          definition: 'Percentage of trial users who become paying customers',
          target: '18-25%',
          why_it_matters: 'Indicates product value and onboarding effectiveness'
        }
      ],

      pipeline_metrics: {
        pipeline_coverage: '3x - Pipeline value should be 3x quota',
        stage_conversion_rates: {
          mql_to_sql: '30%',
          sql_to_demo: '60%',
          demo_to_trial: '70%',
          trial_to_closed: '20-25%'
        },
        velocity_targets: {
          new_mqls_monthly: '300-400',
          new_sqls_monthly: '90-120',
          new_trials_monthly: '60-80',
          new_customers_monthly: '15-20'
        }
      },

      rep_productivity: {
        quota: '$30K MRR per rep per month',
        activities: {
          daily_prospecting_calls: '20-30',
          daily_emails: '40-50',
          demos_per_week: '8-12',
          proposals_per_month: '10-15'
        }
      }
    };
  }

  designSalesProcess(analysis) {
    return {
      process_overview: 'Product-led with sales assist for expansion and enterprise',

      self_serve_motion: {
        who: 'Starter and Professional tiers (<$100/mo)',
        process: 'Sign up → Trial → Self-serve upgrade → Automated onboarding',
        sales_involvement: 'Minimal - only if user requests help or high usage signals',
        tools: 'In-app messaging, email automation, knowledge base'
      },

      sales_assisted_motion: {
        who: 'Business tier ($199/mo) and Enterprise (custom)',
        process: 'Inbound lead → Qualification → Demo → Trial → Sales close → CSM handoff',
        sales_involvement: 'Full - personalized outreach, demos, negotiation',
        tools: 'CRM, demo environment, proposal software, DocuSign'
      },

      tech_stack: {
        crm: 'HubSpot or Pipedrive (free tier to start)',
        sales_engagement: 'Lemlist or Reply.io for sequences',
        meeting_booking: 'Calendly',
        proposal_software: 'PandaDoc',
        analytics: 'Built-in CRM reports + Google Sheets',
        communication: 'Slack, Zoom, Loom for video'
      }
    };
  }

  createSalesEnablement(analysis) {
    return {
      materials_needed: [
        {
          asset: 'One-Pager',
          purpose: 'Leave-behind after demos',
          contents: 'Value props, key features, pricing, customer logos, CTA'
        },
        {
          asset: 'Demo Script',
          purpose: 'Consistent, effective demos',
          contents: 'Opening, discovery recap, demo flow, objection handling, close'
        },
        {
          asset: 'Pricing Calculator',
          purpose: 'Show ROI to prospects',
          contents: 'Input current process cost → output ROI with our solution'
        },
        {
          asset: 'Case Studies (3-5)',
          purpose: 'Proof points and social proof',
          contents: 'Customer story, challenge, solution, results (quantified)'
        },
        {
          asset: 'Competitive Battle Cards',
          purpose: 'Handle "already using X" objections',
          contents: 'Competitor strengths, weaknesses, our differentiators, proof points'
        },
        {
          asset: 'Email Templates',
          purpose: 'Save time, maintain consistency',
          contents: 'Cold outreach, follow-up, meeting reminder, trial check-in, close'
        }
      ],

      training_program: {
        week_1: 'Product deep dive, ICP/persona training',
        week_2: 'Sales process and methodology training',
        week_3: 'Demo certification and practice',
        week_4: 'Shadow calls, then gradual independence',
        ongoing: 'Weekly team training, monthly win/loss reviews'
      }
    };
  }
}

module.exports = SalesAgent;
