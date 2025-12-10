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

  async generateTemplateInsights(conversationAnalysis) {
    // Generate AI-powered sales intelligence for visualization data
    const salesIntelligence = await this.generateSalesIntelligence(conversationAnalysis);

    // Fallback template insights
    return {
      icp: this.defineICP(conversationAnalysis),
      buyer_persona: this.createBuyerPersona(conversationAnalysis),
      lead_gen: this.planLeadGeneration(conversationAnalysis),
      playbook: this.createSalesPlaybook(conversationAnalysis),
      objection_handling: this.createObjectionHandling(conversationAnalysis),
      sales_metrics: this.defineSalesMetrics(conversationAnalysis),
      // New: Visualization data powered by AI analysis
      sales_funnel_data: this.generateSalesFunnelData(conversationAnalysis, salesIntelligence),
      pipeline_metrics: this.generatePipelineMetrics(conversationAnalysis, salesIntelligence),
      conversion_data: this.generateConversionData(conversationAnalysis, salesIntelligence),
      lead_sources_performance: this.generateLeadSourcesPerformance(conversationAnalysis, salesIntelligence),
      sales_activities: this.generateSalesActivities(conversationAnalysis, salesIntelligence),
      sales_team_structure: this.generateSalesTeamStructure(conversationAnalysis, salesIntelligence),
      buyer_journey: this.generateBuyerJourney(conversationAnalysis, salesIntelligence),
      sales_tools_stack: this.generateSalesToolsStack(conversationAnalysis, salesIntelligence),
      competitor_battlecards: this.generateCompetitorBattlecards(conversationAnalysis, salesIntelligence)
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

  // Generate AI-powered sales intelligence specific to the startup idea
  async generateSalesIntelligence(conversationAnalysis) {
    const aiService = require('../services/ai.service');

    try {
      const prompt = `Analyze the sales outlook for this startup and provide realistic data:

Startup Context:
- Industry: ${conversationAnalysis.industry}
- Target Audience: ${conversationAnalysis.targetAudience}
- Problem: ${conversationAnalysis.problem}
- Solution: ${conversationAnalysis.solution}
- Business Model: ${conversationAnalysis.businessModel}

Provide a JSON response with realistic sales intelligence:
{
  "customer_acquisition": {
    "initial_customer_count": number (realistic starting customers at launch),
    "monthly_acquisition_rate": number (new customers per month initially),
    "acquisition_growth_rate": number (e.g., 0.15 for 15% monthly growth in acquisitions)
  },
  "conversion_rates": {
    "visitor_to_mql": number (e.g., 0.035 for 3.5%),
    "mql_to_sql": number (e.g., 0.30 for 30%),
    "sql_to_demo": number (e.g., 0.70 for 70%),
    "demo_to_trial": number (e.g., 0.70 for 70%),
    "trial_to_paid": number (e.g., 0.24 for 24%)
  },
  "sales_cycle": {
    "average_days": number (typical days from first contact to close),
    "demo_duration_minutes": number,
    "trial_duration_days": number
  },
  "deal_metrics": {
    "average_deal_size": number (average annual contract value),
    "win_rate": number (e.g., 0.24 for 24%),
    "monthly_quota_per_rep": number (monthly revenue quota per sales rep)
  },
  "lead_sources": {
    "inbound_content_conversion": number (e.g., 0.078 for 7.8%),
    "paid_ads_conversion": number (e.g., 0.116 for 11.6%),
    "product_led_conversion": number (e.g., 0.20 for 20%),
    "outbound_conversion": number (e.g., 0.108 for 10.8%),
    "referral_conversion": number (e.g., 0.257 for 25.7%)
  },
  "activity_metrics": {
    "calls_per_week": number,
    "emails_per_week": number,
    "demos_per_week": number,
    "proposals_per_month": number
  },
  "pipeline_health": {
    "pipeline_coverage_ratio": number (e.g., 3 for 3x quota),
    "pipeline_value_initial": number (total pipeline value at start),
    "deals_in_pipeline_initial": number
  }
}

Base your analysis on typical sales metrics for similar startups in the ${conversationAnalysis.industry} industry targeting ${conversationAnalysis.targetAudience}.`;

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
      logger.info('Sales intelligence generated via AI', { industry: conversationAnalysis.industry });
      return intelligence;
    } catch (error) {
      logger.warn('AI sales intelligence failed, using educated estimates', error);
      return this.generateFallbackSalesIntelligence(conversationAnalysis);
    }
  }

  // Fallback sales intelligence based on industry patterns
  generateFallbackSalesIntelligence(conversationAnalysis) {
    const industryDefaults = {
      'SaaS': {
        initial_customers: 30,
        monthly_acquisition: 20,
        acquisition_growth: 0.15,
        avg_deal_size: 1800,
        sales_cycle_days: 35,
        win_rate: 0.24
      },
      'E-commerce': {
        initial_customers: 100,
        monthly_acquisition: 50,
        acquisition_growth: 0.20,
        avg_deal_size: 500,
        sales_cycle_days: 7,
        win_rate: 0.35
      },
      'Fintech': {
        initial_customers: 25,
        monthly_acquisition: 15,
        acquisition_growth: 0.18,
        avg_deal_size: 2500,
        sales_cycle_days: 45,
        win_rate: 0.22
      },
      'Healthcare': {
        initial_customers: 20,
        monthly_acquisition: 10,
        acquisition_growth: 0.12,
        avg_deal_size: 3500,
        sales_cycle_days: 60,
        win_rate: 0.20
      }
    };

    const defaults = industryDefaults[conversationAnalysis.industry] || industryDefaults['SaaS'];

    return {
      customer_acquisition: {
        initial_customer_count: defaults.initial_customers,
        monthly_acquisition_rate: defaults.monthly_acquisition,
        acquisition_growth_rate: defaults.acquisition_growth
      },
      conversion_rates: {
        visitor_to_mql: 0.035,
        mql_to_sql: 0.30,
        sql_to_demo: 0.70,
        demo_to_trial: 0.70,
        trial_to_paid: defaults.win_rate
      },
      sales_cycle: {
        average_days: defaults.sales_cycle_days,
        demo_duration_minutes: 30,
        trial_duration_days: 14
      },
      deal_metrics: {
        average_deal_size: defaults.avg_deal_size,
        win_rate: defaults.win_rate,
        monthly_quota_per_rep: 30000
      },
      lead_sources: {
        inbound_content_conversion: 0.078,
        paid_ads_conversion: 0.116,
        product_led_conversion: 0.20,
        outbound_conversion: 0.108,
        referral_conversion: 0.257
      },
      activity_metrics: {
        calls_per_week: 140,
        emails_per_week: 260,
        demos_per_week: 12,
        proposals_per_month: 15
      },
      pipeline_health: {
        pipeline_coverage_ratio: 3,
        pipeline_value_initial: 125000,
        deals_in_pipeline_initial: 45
      }
    };
  }

  // Generate sales funnel visualization data
  generateSalesFunnelData(analysis, salesIntelligence) {
    // Use AI-generated conversion rates
    const visitorToMql = salesIntelligence.conversion_rates.visitor_to_mql;
    const mqlToSql = salesIntelligence.conversion_rates.mql_to_sql;
    const sqlToDemo = salesIntelligence.conversion_rates.sql_to_demo;
    const demoToTrial = salesIntelligence.conversion_rates.demo_to_trial;
    const trialToPaid = salesIntelligence.conversion_rates.trial_to_paid;

    // Calculate funnel stages from 10,000 visitors
    const visitors = 10000;
    const mqls = Math.round(visitors * visitorToMql);
    const sqls = Math.round(mqls * mqlToSql);
    const demos = Math.round(sqls * sqlToDemo);
    const trials = Math.round(demos * demoToTrial);
    const customers = Math.round(trials * trialToPaid);

    return {
      stages: [
        { stage: 'Website Visitors', count: visitors, percentage: 100, color: '#3b82f6' },
        { stage: 'Marketing Qualified Leads', count: mqls, percentage: (visitorToMql * 100).toFixed(1), color: '#10b981' },
        { stage: 'Sales Qualified Leads', count: sqls, percentage: (mqlToSql * 100).toFixed(0), color: '#f59e0b' },
        { stage: 'Product Demos', count: demos, percentage: (sqlToDemo * 100).toFixed(0), color: '#ec4899' },
        { stage: 'Free Trials', count: trials, percentage: (demoToTrial * 100).toFixed(0), color: '#8b5cf6' },
        { stage: 'Paying Customers', count: customers, percentage: (trialToPaid * 100).toFixed(0), color: '#06b6d4' }
      ],
      summary: {
        total_visitors: visitors,
        total_customers: customers,
        overall_conversion: ((customers / visitors) * 100).toFixed(2) + '%',
        avg_time_to_close: `${salesIntelligence.sales_cycle.average_days} days`
      }
    };
  }

  // Generate pipeline metrics
  generatePipelineMetrics(analysis, salesIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = [];

    // Use AI-generated values
    const mqlToSql = salesIntelligence.conversion_rates.mql_to_sql;
    const sqlToDemo = salesIntelligence.conversion_rates.sql_to_demo;
    const winRate = salesIntelligence.deal_metrics.win_rate;
    const dealSize = salesIntelligence.deal_metrics.average_deal_size;
    const acquisitionGrowth = salesIntelligence.customer_acquisition.acquisition_growth_rate;

    // Start with base of 300 leads, growing by acquisition growth rate
    for (let i = 0; i < 6; i++) {
      const newLeads = Math.round(300 * Math.pow(1 + acquisitionGrowth, i));
      const qualified = Math.round(newLeads * mqlToSql);
      const demos = Math.round(qualified * sqlToDemo);
      const closed = Math.round(demos * winRate);

      data.push({
        month: months[i],
        new_leads: newLeads,
        qualified_leads: qualified,
        demos_completed: demos,
        deals_closed: closed,
        pipeline_value: closed * dealSize
      });
    }

    return {
      monthly_data: data,
      current_pipeline: {
        total_value: salesIntelligence.pipeline_health.pipeline_value_initial,
        total_deals: salesIntelligence.pipeline_health.deals_in_pipeline_initial,
        avg_deal_size: dealSize,
        weighted_pipeline: Math.round(salesIntelligence.pipeline_health.pipeline_value_initial * 0.7)
      }
    };
  }

  // Generate conversion rates data
  generateConversionData(analysis, salesIntelligence) {
    // Use AI-generated conversion rates
    const convRates = salesIntelligence.conversion_rates;
    const visitorToMql = convRates.visitor_to_mql * 100;
    const mqlToSql = convRates.mql_to_sql * 100;
    const sqlToDemo = convRates.sql_to_demo * 100;
    const demoToTrial = convRates.demo_to_trial * 100;
    const trialToPaid = convRates.trial_to_paid * 100;

    // Calculate overall conversion
    const overallConversion = (convRates.visitor_to_mql * convRates.mql_to_sql *
                                convRates.sql_to_demo * convRates.demo_to_trial *
                                convRates.trial_to_paid * 100).toFixed(2);

    // Determine status by comparing to benchmark
    const getStatus = (current, benchmark) => {
      if (current >= benchmark * 1.05) return 'above';
      if (current >= benchmark * 0.95) return 'on-track';
      return 'below';
    };

    return {
      conversion_rates: [
        {
          stage: 'Visitor → MQL',
          current: parseFloat(visitorToMql.toFixed(1)),
          target: parseFloat((visitorToMql * 1.15).toFixed(1)),
          benchmark: 4.0,
          status: getStatus(visitorToMql, 4.0)
        },
        {
          stage: 'MQL → SQL',
          current: parseFloat(mqlToSql.toFixed(0)),
          target: parseFloat((mqlToSql * 1.10).toFixed(0)),
          benchmark: 30,
          status: getStatus(mqlToSql, 30)
        },
        {
          stage: 'SQL → Demo',
          current: parseFloat(sqlToDemo.toFixed(0)),
          target: parseFloat((sqlToDemo * 1.05).toFixed(0)),
          benchmark: 60,
          status: getStatus(sqlToDemo, 60)
        },
        {
          stage: 'Demo → Trial',
          current: parseFloat(demoToTrial.toFixed(0)),
          target: parseFloat((demoToTrial * 1.05).toFixed(0)),
          benchmark: 65,
          status: getStatus(demoToTrial, 65)
        },
        {
          stage: 'Trial → Paid',
          current: parseFloat(trialToPaid.toFixed(0)),
          target: parseFloat((trialToPaid * 1.10).toFixed(0)),
          benchmark: 20,
          status: getStatus(trialToPaid, 20)
        }
      ],
      overall_metrics: {
        total_conversion: overallConversion + '%',
        sales_cycle_days: salesIntelligence.sales_cycle.average_days,
        win_rate: (salesIntelligence.deal_metrics.win_rate * 100).toFixed(0) + '%',
        velocity_score: parseFloat((salesIntelligence.deal_metrics.win_rate * 35).toFixed(1))
      }
    };
  }

  // Generate lead sources performance
  generateLeadSourcesPerformance(analysis, salesIntelligence) {
    // Use AI-generated lead source conversions
    const leadSources = salesIntelligence.lead_sources;
    const dealSize = salesIntelligence.deal_metrics.average_deal_size;

    // Calculate leads distribution (total 500 leads)
    const totalLeads = 500;
    const inboundLeads = Math.round(totalLeads * 0.36);
    const paidLeads = Math.round(totalLeads * 0.19);
    const productLedLeads = Math.round(totalLeads * 0.25);
    const outboundLeads = Math.round(totalLeads * 0.13);
    const referralLeads = Math.round(totalLeads * 0.07);

    // Calculate conversions based on AI-generated rates
    const inboundConverted = Math.round(inboundLeads * leadSources.inbound_content_conversion);
    const paidConverted = Math.round(paidLeads * leadSources.paid_ads_conversion);
    const productLedConverted = Math.round(productLedLeads * leadSources.product_led_conversion);
    const outboundConverted = Math.round(outboundLeads * leadSources.outbound_conversion);
    const referralConverted = Math.round(referralLeads * leadSources.referral_conversion);

    // Calculate costs and ROI
    const calcROI = (converted, cost) => Math.round(((converted * dealSize) / cost) * 100);

    const inboundCost = 5400;
    const paidCost = 11400;
    const productLedCost = 2500;
    const outboundCost = 5200;
    const referralCost = 1400;

    const sources = [
      {
        name: 'Inbound Content',
        leads: inboundLeads,
        cost: inboundCost,
        cost_per_lead: Math.round(inboundCost / inboundLeads),
        converted: inboundConverted,
        conversion_rate: parseFloat((leadSources.inbound_content_conversion * 100).toFixed(1)),
        roi: calcROI(inboundConverted, inboundCost)
      },
      {
        name: 'Paid Ads',
        leads: paidLeads,
        cost: paidCost,
        cost_per_lead: Math.round(paidCost / paidLeads),
        converted: paidConverted,
        conversion_rate: parseFloat((leadSources.paid_ads_conversion * 100).toFixed(1)),
        roi: calcROI(paidConverted, paidCost)
      },
      {
        name: 'Product-Led (Free Trial)',
        leads: productLedLeads,
        cost: productLedCost,
        cost_per_lead: Math.round(productLedCost / productLedLeads),
        converted: productLedConverted,
        conversion_rate: parseFloat((leadSources.product_led_conversion * 100).toFixed(1)),
        roi: calcROI(productLedConverted, productLedCost)
      },
      {
        name: 'LinkedIn Outbound',
        leads: outboundLeads,
        cost: outboundCost,
        cost_per_lead: Math.round(outboundCost / outboundLeads),
        converted: outboundConverted,
        conversion_rate: parseFloat((leadSources.outbound_conversion * 100).toFixed(1)),
        roi: calcROI(outboundConverted, outboundCost)
      },
      {
        name: 'Referrals',
        leads: referralLeads,
        cost: referralCost,
        cost_per_lead: Math.round(referralCost / referralLeads),
        converted: referralConverted,
        conversion_rate: parseFloat((leadSources.referral_conversion * 100).toFixed(1)),
        roi: calcROI(referralConverted, referralCost)
      }
    ];

    const totalCost = sources.reduce((sum, s) => sum + s.cost, 0);
    const totalConverted = sources.reduce((sum, s) => sum + s.converted, 0);

    return {
      sources,
      total_leads: totalLeads,
      total_cost: totalCost,
      total_converted: totalConverted,
      avg_conversion: parseFloat(((totalConverted / totalLeads) * 100).toFixed(1)),
      blended_cac: Math.round(totalCost / totalConverted)
    };
  }

  // Generate sales activities data
  generateSalesActivities(analysis, salesIntelligence) {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const data = [];

    // Use AI-generated activity metrics
    const weeklyCallsBase = Math.round(salesIntelligence.activity_metrics.calls_per_week);
    const weeklyEmailsBase = Math.round(salesIntelligence.activity_metrics.emails_per_week);
    const weeklyDemos = Math.round(salesIntelligence.activity_metrics.demos_per_week);
    const monthlyProposals = salesIntelligence.activity_metrics.proposals_per_month;

    let totalCalls = 0;
    let totalEmails = 0;
    let totalDemos = 0;
    let totalProposals = 0;
    let totalDeals = 0;

    for (let i = 0; i < 4; i++) {
      const calls = Math.round(weeklyCallsBase + (i * weeklyCallsBase * 0.08)); // 8% growth per week
      const emails = Math.round(weeklyEmailsBase + (i * weeklyEmailsBase * 0.08));
      const demos = Math.round(weeklyDemos + (i * 0.5));
      const proposals = Math.round(monthlyProposals / 4 + i);
      const deals = Math.round(3 + (i * 0.5));

      totalCalls += calls;
      totalEmails += emails;
      totalDemos += demos;
      totalProposals += proposals;
      totalDeals += deals;

      data.push({
        week: weeks[i],
        calls_made: calls,
        emails_sent: emails,
        demos_completed: demos,
        proposals_sent: proposals,
        deals_closed: deals
      });
    }

    // Calculate activity score (0-100)
    const activityScore = Math.min(100, Math.round(
      (totalCalls / (weeklyCallsBase * 4) * 25) +
      (totalEmails / (weeklyEmailsBase * 4) * 25) +
      (totalDemos / (weeklyDemos * 4) * 25) +
      (totalDeals / 12 * 25)
    ));

    return {
      weekly_data: data,
      monthly_summary: {
        total_calls: totalCalls,
        total_emails: totalEmails,
        total_demos: totalDemos,
        total_proposals: totalProposals,
        total_deals: totalDeals,
        activity_score: activityScore
      }
    };
  }

  // Generate sales team structure
  generateSalesTeamStructure(analysis, salesIntelligence) {
    // Use AI-generated quota from deal metrics
    const monthlyQuotaPerRep = salesIntelligence.deal_metrics.monthly_quota_per_rep;
    const formattedQuota = `$${Math.round(monthlyQuotaPerRep / 1000)}K MRR/month`;

    return {
      current_team: [
        { role: 'Founder/CEO', responsibilities: 'Initial sales, strategy, close enterprise deals', time_allocation: '40%' },
        { role: 'Co-Founder', responsibilities: 'Product demos, customer success', time_allocation: '20%' }
      ],
      hiring_roadmap: [
        {
          month: 3,
          role: 'Sales Development Rep (SDR)',
          why: 'Scale outbound prospecting',
          salary: '$45K-$60K + commission',
          quota: '50-75 SQLs/month',
          ramp_time: '2 months'
        },
        {
          month: 6,
          role: 'Account Executive (AE)',
          why: 'Close mid-market deals',
          salary: '$80K-$100K + commission',
          quota: formattedQuota,
          ramp_time: '3 months'
        },
        {
          month: 9,
          role: 'Customer Success Manager',
          why: 'Reduce churn, drive expansion',
          salary: '$60K-$75K',
          quota: '<5% monthly churn',
          ramp_time: '1 month'
        },
        {
          month: 12,
          role: 'Head of Sales',
          why: 'Build and scale sales organization',
          salary: '$120K-$150K + equity',
          quota: `$${Math.round(monthlyQuotaPerRep * 3.5 / 1000)}K+ MRR/month team quota`,
          ramp_time: '3-4 months'
        }
      ],
      compensation_structure: {
        sdr: { base: '$50K', ote: '$70K', commission: '$20 per SQL' },
        ae: { base: '$90K', ote: '$180K', commission: '10% of first year contract value' },
        manager: { base: '$130K', ote: '$200K', commission: '2% of team revenue + personal quota' }
      }
    };
  }

  // Generate buyer journey
  generateBuyerJourney(analysis, salesIntelligence) {
    // Calculate journey durations based on AI-generated sales cycle
    const totalCycleDays = salesIntelligence.sales_cycle.average_days;
    const demoMinutes = salesIntelligence.sales_cycle.demo_duration_minutes;
    const trialDays = salesIntelligence.sales_cycle.trial_duration_days;

    // Distribute cycle time across stages
    const awarenessWeeks = Math.round((totalCycleDays * 0.25) / 7);
    const considerationWeeks = Math.round((totalCycleDays * 0.35) / 7);
    const decisionWeeks = Math.round((totalCycleDays * 0.20) / 7);
    const onboardingWeeks = Math.round((totalCycleDays * 0.20) / 7);

    return {
      stages: [
        {
          stage: 'Awareness',
          buyer_state: 'Experiencing pain, searching for solutions',
          touchpoints: ['Blog post', 'Google search', 'LinkedIn post', 'Industry event'],
          content_needed: ['Problem-focused blog posts', 'Educational videos', 'Case studies'],
          sales_action: 'Provide value, educate, build trust',
          duration: awarenessWeeks > 0 ? `${awarenessWeeks} week${awarenessWeeks > 1 ? 's' : ''}` : '3-5 days'
        },
        {
          stage: 'Consideration',
          buyer_state: 'Comparing options, building business case',
          touchpoints: ['Website', `Product demo (${demoMinutes} min)`, 'Competitor comparison', 'G2 reviews'],
          content_needed: ['Product comparison guide', 'ROI calculator', 'Customer testimonials'],
          sales_action: 'Demo product, address objections, provide proof points',
          duration: considerationWeeks > 0 ? `${considerationWeeks} week${considerationWeeks > 1 ? 's' : ''}` : '5-7 days'
        },
        {
          stage: 'Decision',
          buyer_state: 'Ready to buy, need approval, negotiating terms',
          touchpoints: ['Proposal', `Free trial (${trialDays} days)`, 'Contract review', 'Reference calls'],
          content_needed: ['Proposal template', 'Security docs', 'Reference customers'],
          sales_action: 'Handle procurement, provide references, close deal',
          duration: decisionWeeks > 0 ? `${decisionWeeks} week${decisionWeeks > 1 ? 's' : ''}` : '3-5 days'
        },
        {
          stage: 'Onboarding',
          buyer_state: 'Implementing, training team, seeking quick wins',
          touchpoints: ['Kickoff call', 'Training sessions', 'Support tickets', 'Check-in calls'],
          content_needed: ['Onboarding checklist', 'Video tutorials', 'Best practices guide'],
          sales_action: 'Ensure smooth activation, gather feedback',
          duration: onboardingWeeks > 0 ? `${onboardingWeeks} week${onboardingWeeks > 1 ? 's' : ''}` : '1-2 weeks'
        },
        {
          stage: 'Expansion',
          buyer_state: 'Finding value, considering upgrades or add-ons',
          touchpoints: ['QBRs', 'Feature announcements', 'Account reviews', 'Upsell conversations'],
          content_needed: ['Product roadmap', 'Advanced features guide', 'Success metrics dashboard'],
          sales_action: 'Identify expansion opportunities, demonstrate ROI',
          duration: 'Ongoing (Month 3+)'
        }
      ],
      key_decision_factors: [
        'ROI and time to value',
        'Ease of implementation',
        'Quality of customer support',
        'Product features and roadmap',
        'Pricing and contract flexibility',
        'Integration capabilities',
        'Security and compliance'
      ],
      total_cycle_length: `${totalCycleDays} days average`
    };
  }

  // Generate sales tools stack
  generateSalesToolsStack(analysis, salesIntelligence) {
    return {
      categories: [
        {
          category: 'CRM & Pipeline Management',
          tools: [
            { tool: 'HubSpot CRM', purpose: 'Free CRM for pipeline tracking', cost: 'Free → $50/mo', priority: 'Critical' },
            { tool: 'Pipedrive', purpose: 'Alternative CRM focused on sales', cost: '$15/user/mo', priority: 'Critical' }
          ]
        },
        {
          category: 'Sales Engagement',
          tools: [
            { tool: 'Lemlist', purpose: 'Email sequences and follow-ups', cost: '$59/mo', priority: 'High' },
            { tool: 'Apollo.io', purpose: 'B2B contact database + outreach', cost: '$49/mo', priority: 'High' },
            { tool: 'LinkedIn Sales Navigator', purpose: 'Prospecting on LinkedIn', cost: '$80/mo', priority: 'Medium' }
          ]
        },
        {
          category: 'Meeting & Scheduling',
          tools: [
            { tool: 'Calendly', purpose: 'Easy meeting scheduling', cost: 'Free → $10/mo', priority: 'High' },
            { tool: 'Zoom', purpose: 'Video calls and demos', cost: '$15/mo', priority: 'Critical' },
            { tool: 'Loom', purpose: 'Async video messages', cost: 'Free → $10/mo', priority: 'Medium' }
          ]
        },
        {
          category: 'Proposals & Contracts',
          tools: [
            { tool: 'PandaDoc', purpose: 'Proposals and e-signatures', cost: '$35/mo', priority: 'High' },
            { tool: 'DocuSign', purpose: 'E-signature alternative', cost: '$25/mo', priority: 'Medium' }
          ]
        },
        {
          category: 'Analytics & Reporting',
          tools: [
            { tool: 'Google Data Studio', purpose: 'Custom sales dashboards', cost: 'Free', priority: 'Medium' },
            { tool: 'Gong/Chorus', purpose: 'Call recording and coaching', cost: '$100+/user/mo', priority: 'Low (later stage)' }
          ]
        }
      ],
      total_monthly_cost: {
        essential: '$200-300/month',
        recommended: '$400-600/month',
        advanced: '$800-1200/month'
      },
      implementation_priority: [
        '1. CRM (HubSpot or Pipedrive) - Day 1',
        '2. Meeting scheduling (Calendly) - Week 1',
        '3. Email sequences (Lemlist) - Week 2',
        '4. Proposals (PandaDoc) - Month 1',
        '5. Prospecting tools (Apollo/LinkedIn) - Month 2+'
      ]
    };
  }

  // Generate competitor battlecards
  generateCompetitorBattlecards(analysis, salesIntelligence) {
    return {
      competitors: [
        {
          name: 'Legacy Enterprise Solution',
          market_position: 'Market leader (35% share)',
          pricing: 'Enterprise: $50K-$500K/year',
          strengths: [
            'Established brand and trust',
            'Comprehensive feature set',
            'Large customer base',
            'Enterprise-grade security'
          ],
          weaknesses: [
            'Outdated UI/UX',
            'Complex implementation (6+ months)',
            'Expensive pricing',
            'Slow to innovate',
            'Poor customer support'
          ],
          how_to_compete: [
            'Position as modern, user-friendly alternative',
            'Emphasize speed to value (days not months)',
            'Showcase 70% cost savings',
            'Highlight superior customer support'
          ],
          proof_points: [
            'Customer testimonial: "We switched from [Legacy] and onboarded in 1 week vs 6 months"',
            'ROI calculator showing $40K annual savings',
            'Comparison chart: 5-star UX vs 2-star UX'
          ]
        },
        {
          name: 'Fast-Growing Startup Competitor',
          market_position: 'Rising challenger (8% share)',
          pricing: 'SMB: $99-$499/month',
          strengths: [
            'Modern technology',
            'Good user experience',
            'Aggressive pricing',
            'Fast product iteration'
          ],
          weaknesses: [
            'Limited enterprise features',
            'Fewer integrations',
            'Smaller support team',
            'Less proven at scale',
            'Funding uncertainty'
          ],
          how_to_compete: [
            'Match on innovation, beat on execution',
            'Highlight enterprise features they lack',
            'Emphasize financial stability',
            'Show broader integration ecosystem'
          ],
          proof_points: [
            'Feature comparison: We have 15 integrations vs their 5',
            'Enterprise case study they can\'t match',
            'Show our team experience and funding'
          ]
        },
        {
          name: 'DIY/Spreadsheets/Manual Process',
          market_position: 'Default (40% of market still manual)',
          pricing: 'Free (but high opportunity cost)',
          strengths: [
            'No direct cost',
            'Complete control',
            'Familiar to teams',
            'No vendor lock-in'
          ],
          weaknesses: [
            'Extremely time-consuming',
            'Error-prone',
            'Doesn\'t scale',
            'No automation',
            'Limited collaboration',
            'No insights or analytics'
          ],
          how_to_compete: [
            'Calculate true cost (time = money)',
            'Demonstrate time savings (10+ hours/week)',
            'Show error reduction (fewer costly mistakes)',
            'Highlight scalability for growth'
          ],
          proof_points: [
            'ROI calculator: 15 hours/week saved = $30K/year',
            'Case study: Reduced errors by 90%',
            'Show how automation enables scaling'
          ]
        }
      ],
      general_objection_responses: {
        'Too expensive': 'Let\'s look at ROI - we typically save 15 hours/week worth [$X]. That\'s a 5x return in month 1.',
        'Happy with current solution': 'That\'s great! What would make it even better? [Listen, then show how we solve that]',
        'Not the right time': 'I understand. What\'s happening [next quarter] that makes it better timing? [Uncover real objection]',
        'Need more features': 'What specific features? [Listen] Good news - we have that roadmapped for [timeline]. Want to influence prioritization?'
      }
    };
  }
}

module.exports = SalesAgent;
