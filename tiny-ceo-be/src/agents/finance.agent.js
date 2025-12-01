const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');

/**
 * Finance Agent
 * Handles pricing, revenue projections, unit economics, and financial planning
 */
class FinanceAgent extends BaseAgent {
  constructor() {
    super(
      'Finance',
      'Chief Financial Officer & Financial Analyst',
      [
        'Pricing strategy',
        'Revenue projections',
        'Unit economics (CAC, LTV, payback)',
        'Budget planning',
        'Breakeven analysis',
        'Financial modeling'
      ]
    );
  }

  async analyze(conversationAnalysis) {
    logger.agent('Finance', 'Starting financial analysis');

    const aiService = require('../services/ai.service');

    try {
      const instructions = `Generate a comprehensive financial analysis with the following JSON structure:
{
  "pricing": {
    "strategy": "string (pricing approach)",
    "tiers": [
      {
        "name": "string (tier name)",
        "price": "string (monthly price)",
        "annual_price": "string (annual price)",
        "features": ["string (key features)"],
        "target_customer": "string"
      }
    ],
    "rationale": "string (why this pricing)"
  },
  "revenue_projections": {
    "year_1": {
      "q1": "string (revenue)", "q2": "string", "q3": "string", "q4": "string",
      "total": "string",
      "customers": "string (customer count)"
    },
    "year_2": {
      "total": "string",
      "customers": "string"
    },
    "year_3": {
      "total": "string",
      "customers": "string"
    }
  },
  "unit_economics": {
    "cac": "string (customer acquisition cost)",
    "ltv": "string (lifetime value)",
    "ltv_cac_ratio": "string",
    "payback_period": "string (months)",
    "gross_margin": "string (percentage)"
  },
  "budget": {
    "monthly_burn": "string",
    "cost_breakdown": {
      "engineering": "string",
      "sales_marketing": "string",
      "operations": "string",
      "infrastructure": "string"
    }
  },
  "breakeven": {
    "months_to_breakeven": "string",
    "revenue_needed": "string",
    "customers_needed": "string"
  }
}

Base your analysis on the actual business model and target market. Provide realistic financial projections tailored to THIS startup.`;

      const insights = await aiService.generateAgentAnalysis('finance', conversationAnalysis, instructions);

      if (insights.error) {
        logger.warn('Finance AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis);
      }

      logger.agent('Finance', 'Financial analysis completed');
      return insights;
    } catch (error) {
      logger.error('Finance analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis);
    }
  }

  async generateTemplateInsights(conversationAnalysis) {
    const { industry } = conversationAnalysis;
    const pricingData = await this.searchPricingBenchmarks(industry, 'saas');

    return {
      pricing: this.generatePricingStrategy(pricingData, conversationAnalysis),
      revenue_projections: this.generateRevenueProjections(conversationAnalysis),
      unit_economics: this.calculateUnitEconomics(conversationAnalysis),
      budget: this.generateBudget(conversationAnalysis),
      breakeven: this.calculateBreakeven(conversationAnalysis),
      financial_metrics: this.defineFinancialMetrics(),
      funding_runway: this.calculateRunway(conversationAnalysis)
    };
  }

  generatePricingStrategy(pricingData, analysis) {
    const benchmarks = pricingData.benchmarks || {};

    return {
      strategy: 'Value-based tiered pricing to maximize revenue across customer segments',
      pricing_model: 'SaaS subscription with monthly and annual options',
      tiers: [
        {
          name: 'Starter',
          monthly_price: '$29',
          annual_price: '$24/mo ($288/year)',
          annual_savings: '17%',
          target_customer: 'Individuals and freelancers',
          features: [
            'Core features access',
            'Up to 5 projects',
            'Email support',
            'Basic analytics',
            '1 user seat'
          ],
          expected_adoption: '35-40% of paying customers',
          positioning: 'Entry-level plan for getting started'
        },
        {
          name: 'Professional',
          monthly_price: '$79',
          annual_price: '$66/mo ($792/year)',
          annual_savings: '16%',
          target_customer: 'Small teams (5-20 people)',
          features: [
            'All Starter features',
            'Unlimited projects',
            'Priority support',
            'Advanced analytics',
            'Team collaboration (up to 10 seats)',
            'API access',
            'Custom integrations'
          ],
          expected_adoption: '45-50% of paying customers',
          positioning: 'Most popular - best value',
          recommended: true
        },
        {
          name: 'Business',
          monthly_price: '$199',
          annual_price: '$166/mo ($1,992/year)',
          annual_savings: '17%',
          target_customer: 'Growing businesses (20-100 people)',
          features: [
            'All Professional features',
            'Unlimited seats',
            'Dedicated account manager',
            'SLA guarantees (99.9% uptime)',
            'Advanced security & compliance',
            'Custom onboarding',
            'Quarterly business reviews'
          ],
          expected_adoption: '12-15% of paying customers',
          positioning: 'For teams that need enterprise features'
        },
        {
          name: 'Enterprise',
          monthly_price: 'Custom',
          annual_price: 'Custom (starts at $500/mo)',
          target_customer: 'Large organizations (100+ people)',
          features: [
            'All Business features',
            'Custom deployment options',
            'White-label capabilities',
            'Training & onboarding programs',
            '24/7 phone support',
            'Custom SLA',
            'Volume discounts'
          ],
          expected_adoption: '3-5% of paying customers',
          positioning: 'Enterprise-grade with custom terms'
        }
      ],
      pricing_psychology: {
        anchor_price: 'Professional tier at $79/mo',
        decoy_effect: 'Business tier makes Professional look like great value',
        annual_discount: '15-17% to improve cash flow and reduce churn',
        trial_strategy: '14-day free trial, no credit card required'
      },
      price_testing_plan: [
        'Launch with these prices',
        'A/B test price points after 100 customers',
        'Survey price sensitivity',
        'Consider value metric pricing (usage-based) in future'
      ],
      competitor_positioning: {
        vs_premium: '30-40% lower than enterprise solutions',
        vs_budget: '20-30% higher than basic tools',
        justification: 'Premium features at accessible price point'
      }
    };
  }

  generateRevenueProjections(analysis) {
    return {
      assumptions: {
        avg_revenue_per_user: '$58/month (blended across tiers)',
        monthly_growth_rate: {
          months_1_6: '15-20%',
          months_7_12: '12-15%',
          year_2: '10-12%'
        },
        annual_churn: '30% (2.5% monthly)',
        free_to_paid_conversion: '3-5%',
        trial_to_paid_conversion: '18-22%'
      },
      year_1: {
        conservative: {
          customers_by_eoy: 180,
          mrr: '$10,440',
          arr: '$125,280',
          quarterly_breakdown: [
            { quarter: 'Q1', customers: 30, mrr: '$1,740', arr_run_rate: '$20,880' },
            { quarter: 'Q2', customers: 70, mrr: '$4,060', arr_run_rate: '$48,720' },
            { quarter: 'Q3', customers: 120, mrr: '$6,960', arr_run_rate: '$83,520' },
            { quarter: 'Q4', customers: 180, mrr: '$10,440', arr_run_rate: '$125,280' }
          ]
        },
        realistic: {
          customers_by_eoy: 300,
          mrr: '$17,400',
          arr: '$208,800',
          quarterly_breakdown: [
            { quarter: 'Q1', customers: 50, mrr: '$2,900', arr_run_rate: '$34,800' },
            { quarter: 'Q2', customers: 120, mrr: '$6,960', arr_run_rate: '$83,520' },
            { quarter: 'Q3', customers: 200, mrr: '$11,600', arr_run_rate: '$139,200' },
            { quarter: 'Q4', customers: 300, mrr: '$17,400', arr_run_rate: '$208,800' }
          ]
        },
        optimistic: {
          customers_by_eoy: 500,
          mrr: '$29,000',
          arr: '$348,000',
          quarterly_breakdown: [
            { quarter: 'Q1', customers: 80, mrr: '$4,640', arr_run_rate: '$55,680' },
            { quarter: 'Q2', customers: 200, mrr: '$11,600', arr_run_rate: '$139,200' },
            { quarter: 'Q3', customers: 350, mrr: '$20,300', arr_run_rate: '$243,600' },
            { quarter: 'Q4', customers: 500, mrr: '$29,000', arr_run_rate: '$348,000' }
          ]
        }
      },
      year_2: {
        conservative: '$360K ARR (540 customers)',
        realistic: '$625K ARR (900 customers)',
        optimistic: '$1.2M ARR (1,500 customers)'
      },
      year_3: {
        conservative: '$840K ARR (1,200 customers)',
        realistic: '$1.8M ARR (2,400 customers)',
        optimistic: '$3.5M ARR (4,500 customers)'
      },
      revenue_mix_by_tier: {
        starter: '25% of revenue',
        professional: '50% of revenue',
        business: '20% of revenue',
        enterprise: '5% of revenue'
      }
    };
  }

  calculateUnitEconomics(analysis) {
    return {
      customer_acquisition_cost: {
        cac: '$210',
        breakdown: {
          paid_advertising: '$120 (57%)',
          content_marketing: '$40 (19%)',
          sales_team: '$30 (14%)',
          tools_and_overhead: '$20 (10%)'
        },
        calculation: 'Total Sales & Marketing Spend / New Customers Acquired',
        benchmark: 'Target: <$250 for SMB SaaS'
      },
      lifetime_value: {
        ltv: '$1,740',
        calculation: 'ARPU ($58) × Average Customer Lifetime (30 months)',
        breakdown: {
          arpu: '$58/month (blended)',
          average_lifetime: '30 months',
          churn_rate: '2.5% monthly'
        },
        benchmark: 'Good LTV for SMB SaaS: $1,500-$3,000'
      },
      ltv_to_cac_ratio: {
        ratio: '8.3:1',
        verdict: 'Excellent',
        benchmark_ranges: {
          poor: '<3:1',
          acceptable: '3:1 - 4:1',
          good: '4:1 - 6:1',
          excellent: '>6:1'
        },
        note: 'Ratio >6:1 indicates healthy, sustainable growth'
      },
      payback_period: {
        months: 3.6,
        calculation: 'CAC / (ARPU × Gross Margin)',
        gross_margin: '85%',
        benchmark: 'Target: <12 months, Good: <6 months',
        verdict: 'Very good - allows rapid reinvestment in growth'
      },
      metrics_summary: {
        arpu: '$58/month',
        cac: '$210',
        ltv: '$1,740',
        ltv_cac: '8.3:1',
        payback: '3.6 months',
        gross_margin: '85%',
        magic_number: '0.85 (efficient growth)'
      },
      optimization_opportunities: [
        'Test higher-tier upsells to increase ARPU',
        'Implement referral program to reduce CAC',
        'Focus on customer success to reduce churn',
        'Optimize onboarding to improve activation'
      ]
    };
  }

  generateBudget(analysis) {
    return {
      year_1_expenses: {
        total: '$440,000',
        monthly_burn: '$36,667',
        breakdown: [
          {
            category: 'Engineering & Product',
            annual: '$160,000',
            monthly: '$13,333',
            details: '2 engineers ($70K each), 1 product manager/designer ($60K part-time), tools ($400/mo)'
          },
          {
            category: 'Sales & Marketing',
            annual: '$120,000',
            monthly: '$10,000',
            details: 'Paid ads ($4K/mo), content ($2K/mo), tools ($1K/mo), events ($3K/mo)'
          },
          {
            category: 'Operations & Infrastructure',
            annual: '$60,000',
            monthly: '$5,000',
            details: 'Cloud hosting ($1.5K), tools & software ($2K), legal & accounting ($1.5K)'
          },
          {
            category: 'Founder Salaries',
            annual: '$100,000',
            monthly: '$8,333',
            details: '2 founders at $50K each (below-market to preserve runway)'
          }
        ],
        cost_of_goods_sold: {
          per_customer_monthly: '$8.70',
          breakdown: {
            hosting: '$3.50',
            ai_api_costs: '$2.00',
            third_party_services: '$2.20',
            support_costs: '$1.00'
          },
          gross_margin: '85%'
        }
      },
      funding_requirements: {
        seed_raise: '$750,000',
        runway: '18 months at $36.7K monthly burn',
        buffer: 'Includes 2-month buffer for contingencies',
        runway_extension_plan: 'Revenue starts offsetting costs by month 12'
      },
      cost_control_measures: [
        'Use contractors for non-core functions',
        'Leverage free tiers and startup credits (AWS, GCP)',
        'Delay non-essential hires until product-market fit',
        'Negotiate annual deals for 15-20% savings',
        'Remote-first to avoid office expenses'
      ]
    };
  }

  calculateBreakeven(analysis) {
    const monthlyBurn = 36667;
    const arpu = 58;
    const grossMargin = 0.85;

    const customersNeeded = Math.ceil(monthlyBurn / (arpu * grossMargin));

    return {
      timeline: 'Month 16-20 (realistic scenario)',
      customers_needed: customersNeeded,
      mrr_target: this.formatCurrency(monthlyBurn),
      arr_target: this.formatCurrency(monthlyBurn * 12),
      path_to_breakeven: [
        {
          milestone: 'Month 6: $10K MRR',
          revenue: '$10,000',
          burn: '$36,667',
          net: '-$26,667',
          runway_remaining: '12 months'
        },
        {
          milestone: 'Month 12: $25K MRR',
          revenue: '$25,000',
          burn: '$36,667',
          net: '-$11,667',
          runway_remaining: '6 months (+ need bridge or revenue growth)'
        },
        {
          milestone: 'Month 18: $40K MRR',
          revenue: '$40,000',
          burn: '$35,000 (optimized)',
          net: '+$5,000',
          status: 'Cash flow positive!'
        }
      ],
      assumptions: [
        'Burn rate decreases slightly as processes optimize',
        'Revenue growth 12-15% monthly',
        'Gross margin maintained at 85%',
        'No major unexpected expenses'
      ],
      contingency_plan: {
        if_behind_plan: [
          'Reduce marketing spend temporarily',
          'Delay non-critical hires',
          'Raise small bridge round ($200-300K)',
          'Focus on upselling existing customers'
        ],
        if_ahead_of_plan: [
          'Accelerate hiring for growth roles',
          'Increase marketing budget for faster growth',
          'Invest in product expansion',
          'Consider raising Series A earlier'
        ]
      }
    };
  }

  defineFinancialMetrics() {
    return [
      {
        metric: 'Monthly Recurring Revenue (MRR)',
        definition: 'Predictable monthly revenue from subscriptions',
        why_track: 'Primary indicator of business growth',
        target: '$10K by month 6, $50K by month 12',
        formula: 'Sum of all monthly subscription revenue'
      },
      {
        metric: 'Annual Recurring Revenue (ARR)',
        definition: 'MRR × 12',
        why_track: 'Used for valuation and planning',
        target: '$600K by end of year 1',
        formula: 'MRR × 12'
      },
      {
        metric: 'Customer Acquisition Cost (CAC)',
        definition: 'Cost to acquire one new customer',
        why_track: 'Measures marketing efficiency',
        target: '<$250',
        formula: 'Total Sales & Marketing Spend / New Customers'
      },
      {
        metric: 'Customer Lifetime Value (LTV)',
        definition: 'Total revenue from a customer over their lifetime',
        why_track: 'Determines how much you can spend to acquire customers',
        target: '>$1,500',
        formula: 'ARPU / Monthly Churn Rate'
      },
      {
        metric: 'LTV:CAC Ratio',
        definition: 'Ratio of lifetime value to acquisition cost',
        why_track: 'Key indicator of sustainable growth',
        target: '>5:1',
        formula: 'LTV / CAC'
      },
      {
        metric: 'Gross Margin',
        definition: 'Revenue minus cost of goods sold',
        why_track: 'Shows profitability potential',
        target: '>80% for SaaS',
        formula: '(Revenue - COGS) / Revenue'
      },
      {
        metric: 'Monthly Churn Rate',
        definition: 'Percentage of customers lost per month',
        why_track: 'Indicates product stickiness',
        target: '<3% monthly',
        formula: 'Customers Lost / Total Customers at Start of Month'
      },
      {
        metric: 'Net Revenue Retention (NRR)',
        definition: 'Revenue retention including upgrades and downgrades',
        why_track: 'Shows if existing customers are growing',
        target: '>100% (indicates expansion)',
        formula: '(Starting MRR + Expansion - Churn) / Starting MRR'
      }
    ];
  }

  calculateRunway(analysis) {
    return {
      initial_raise: '$750,000',
      monthly_burn: '$36,667',
      initial_runway: '20.5 months',
      runway_by_milestone: [
        {
          month: 0,
          cash: '$750,000',
          revenue: '$0',
          burn: '$36,667',
          runway: '20.5 months'
        },
        {
          month: 6,
          cash: '$530,000',
          revenue: '$10,000',
          burn: '$36,667',
          net_burn: '$26,667',
          runway: '19.9 months'
        },
        {
          month: 12,
          cash: '$370,000',
          revenue: '$25,000',
          burn: '$36,667',
          net_burn: '$11,667',
          runway: '31.7 months (revenue extending runway)'
        },
        {
          month: 18,
          cash: '$300,000+',
          revenue: '$40,000',
          burn: '$35,000',
          net_burn: '-$5,000',
          status: 'Cash flow positive, runway infinite'
        }
      ],
      fundraising_triggers: [
        'Raise Series A when: >$1M ARR, >15% MoM growth, <18 months runway',
        'Raise bridge if: Revenue growth slower than planned and <9 months runway',
        'Raise extension if: Strong metrics but need more time to hit Series A thresholds'
      ]
    };
  }
}

module.exports = FinanceAgent;
