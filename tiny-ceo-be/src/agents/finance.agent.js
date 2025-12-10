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

  async analyze(conversationAnalysis, options = {}) {
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

      const insights = await aiService.generateAgentAnalysis('finance', conversationAnalysis, instructions, options);

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

    // Generate AI-powered financial intelligence for visualization data
    const financialIntelligence = await this.generateFinancialIntelligence(conversationAnalysis);

    return {
      pricing: this.generatePricingStrategy(pricingData, conversationAnalysis),
      revenue_projections: this.generateRevenueProjections(conversationAnalysis),
      unit_economics: this.calculateUnitEconomics(conversationAnalysis),
      budget: this.generateBudget(conversationAnalysis),
      breakeven: this.calculateBreakeven(conversationAnalysis),
      financial_metrics: this.defineFinancialMetrics(),
      funding_runway: this.calculateRunway(conversationAnalysis),
      // New: Visualization data powered by AI analysis
      cash_flow_data: this.generateCashFlowData(conversationAnalysis, financialIntelligence),
      monthly_financials: this.generateMonthlyFinancials(conversationAnalysis, financialIntelligence),
      revenue_scenarios: this.generateRevenueScenarios(conversationAnalysis, financialIntelligence),
      expense_breakdown: this.generateExpenseBreakdown(conversationAnalysis, financialIntelligence),
      burn_rate_runway: this.generateBurnRateRunway(conversationAnalysis, financialIntelligence),
      profitability_timeline: this.generateProfitabilityTimeline(conversationAnalysis, financialIntelligence)
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

  // Generate cash flow data for visualization
  // Generate AI-powered financial intelligence specific to the startup idea
  async generateFinancialIntelligence(conversationAnalysis) {
    const aiService = require('../services/ai.service');

    try {
      const prompt = `Analyze the financial outlook for this startup and provide realistic data:

Startup Context:
- Industry: ${conversationAnalysis.industry}
- Target Audience: ${conversationAnalysis.targetAudience}
- Problem: ${conversationAnalysis.problem}
- Solution: ${conversationAnalysis.solution}
- Business Model: ${conversationAnalysis.businessModel}

Provide a JSON response with realistic financial intelligence:
{
  "revenue_model": {
    "initial_mrr": number (realistic starting monthly recurring revenue),
    "monthly_growth_rate": number (e.g., 0.15 for 15% MoM growth),
    "average_deal_size": number (average revenue per customer per month)
  },
  "costs": {
    "initial_funding": number (typical seed funding amount),
    "monthly_burn_rate": number (monthly operating expenses),
    "fixed_costs_percentage": number (e.g., 0.60 for 60% fixed costs),
    "variable_costs_percentage": number (e.g., 0.20 for 20% COGS)
  },
  "growth_metrics": {
    "customer_acquisition_cost": number,
    "customer_lifetime_value": number,
    "monthly_churn_rate": number (e.g., 0.05 for 5%),
    "gross_margin_percentage": number (e.g., 0.75 for 75%)
  },
  "runway": {
    "months_to_break_even": number,
    "total_funding_needed": number,
    "runway_months": number
  }
}

Base your analysis on typical financial metrics for similar startups in the ${conversationAnalysis.industry} industry.`;

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
      logger.info('Financial intelligence generated via AI', { industry: conversationAnalysis.industry });
      return intelligence;
    } catch (error) {
      logger.warn('AI financial intelligence failed, using educated estimates', error);
      return this.generateFallbackFinancialIntelligence(conversationAnalysis);
    }
  }

  // Fallback financial intelligence based on industry patterns
  generateFallbackFinancialIntelligence(conversationAnalysis) {
    const industryDefaults = {
      'SaaS': {
        initial_mrr: 5000,
        monthly_growth_rate: 0.15,
        initial_funding: 750000,
        monthly_burn_rate: 35000,
        cac: 150,
        ltv: 1200,
        churn_rate: 0.05
      },
      'E-commerce': {
        initial_mrr: 8000,
        monthly_growth_rate: 0.20,
        initial_funding: 500000,
        monthly_burn_rate: 30000,
        cac: 80,
        ltv: 800,
        churn_rate: 0.08
      },
      'Fintech': {
        initial_mrr: 6000,
        monthly_growth_rate: 0.18,
        initial_funding: 1000000,
        monthly_burn_rate: 45000,
        cac: 200,
        ltv: 1500,
        churn_rate: 0.04
      },
      'Healthcare': {
        initial_mrr: 10000,
        monthly_growth_rate: 0.12,
        initial_funding: 1200000,
        monthly_burn_rate: 50000,
        cac: 300,
        ltv: 2000,
        churn_rate: 0.03
      }
    };

    const defaults = industryDefaults[conversationAnalysis.industry] || industryDefaults['SaaS'];

    return {
      revenue_model: {
        initial_mrr: defaults.initial_mrr,
        monthly_growth_rate: defaults.monthly_growth_rate,
        average_deal_size: 50
      },
      costs: {
        initial_funding: defaults.initial_funding,
        monthly_burn_rate: defaults.monthly_burn_rate,
        fixed_costs_percentage: 0.60,
        variable_costs_percentage: 0.20
      },
      growth_metrics: {
        customer_acquisition_cost: defaults.cac,
        customer_lifetime_value: defaults.ltv,
        monthly_churn_rate: defaults.churn_rate,
        gross_margin_percentage: 0.75
      },
      runway: {
        months_to_break_even: Math.ceil(defaults.monthly_burn_rate / (defaults.initial_mrr * defaults.monthly_growth_rate)),
        total_funding_needed: defaults.initial_funding,
        runway_months: Math.floor(defaults.initial_funding / defaults.monthly_burn_rate)
      }
    };
  }

  generateCashFlowData(analysis, financialIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    // Use AI-generated values
    const initialFunding = financialIntelligence.costs.initial_funding;
    const monthlyBurnRate = financialIntelligence.costs.monthly_burn_rate;
    const initialMRR = financialIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = financialIntelligence.revenue_model.monthly_growth_rate;

    let cumulativeCash = initialFunding;

    for (let i = 0; i < 12; i++) {
      // Revenue grows based on AI-generated growth rate
      const revenue = Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, i));

      // Expenses based on AI-generated burn rate
      const expenses = monthlyBurnRate;

      const netCashFlow = revenue - expenses;
      cumulativeCash += netCashFlow;

      data.push({
        month: months[i],
        revenue: revenue,
        expenses: expenses,
        net_cash_flow: netCashFlow,
        cumulative_cash: Math.round(cumulativeCash),
        runway_months: cumulativeCash > 0 ? Math.round(cumulativeCash / expenses) : 0
      });
    }

    return {
      monthly_data: data,
      summary: {
        starting_cash: initialFunding,
        ending_cash: Math.round(cumulativeCash),
        total_revenue: data.reduce((sum, m) => sum + m.revenue, 0),
        total_expenses: data.reduce((sum, m) => sum + m.expenses, 0),
        average_runway: cumulativeCash > 0 ? Math.round(cumulativeCash / monthlyBurnRate) : 0
      }
    };
  }

  // Generate monthly P&L data
  generateMonthlyFinancials(analysis, financialIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    // Use AI-generated values
    const initialMRR = financialIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = financialIntelligence.revenue_model.monthly_growth_rate;
    const variableCostsPct = financialIntelligence.costs.variable_costs_percentage;
    const monthlyBurnRate = financialIntelligence.costs.monthly_burn_rate;
    const grossMarginPct = financialIntelligence.growth_metrics.gross_margin_percentage;

    // Calculate COGS percentage from gross margin
    const cogsPct = 1 - grossMarginPct;

    // Breakdown of operating expenses (based on burn rate)
    const engineering = Math.round(monthlyBurnRate * 0.36); // 36% of burn
    const salesMarketing = Math.round(monthlyBurnRate * 0.27); // 27% of burn
    const operations = Math.round(monthlyBurnRate * 0.14); // 14% of burn
    const salaries = Math.round(monthlyBurnRate * 0.23); // 23% of burn

    for (let i = 0; i < 12; i++) {
      const revenue = Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, i));
      const cogs = Math.round(revenue * cogsPct);
      const grossProfit = revenue - cogs;

      const totalOpex = engineering + salesMarketing + operations + salaries;

      const ebitda = grossProfit - totalOpex;
      const netIncome = ebitda; // Simplified, no taxes/interest for early stage

      data.push({
        month: months[i],
        revenue: revenue,
        cogs: cogs,
        gross_profit: grossProfit,
        gross_margin: ((grossProfit / revenue) * 100).toFixed(1),
        engineering: engineering,
        sales_marketing: salesMarketing,
        operations: operations,
        salaries: salaries,
        total_opex: totalOpex,
        ebitda: ebitda,
        net_income: netIncome,
        net_margin: ((netIncome / revenue) * 100).toFixed(1)
      });
    }

    return {
      monthly_data: data,
      annual_summary: {
        total_revenue: data.reduce((sum, m) => sum + m.revenue, 0),
        total_cogs: data.reduce((sum, m) => sum + m.cogs, 0),
        total_opex: data.reduce((sum, m) => sum + m.total_opex, 0),
        net_income: data.reduce((sum, m) => sum + m.net_income, 0),
        avg_gross_margin: (grossMarginPct * 100).toFixed(1) + '%',
        avg_net_margin: ((data.reduce((sum, m) => sum + m.net_income, 0) / data.reduce((sum, m) => sum + m.revenue, 0)) * 100).toFixed(1) + '%'
      }
    };
  }

  // Generate revenue scenario projections
  generateRevenueScenarios(analysis, financialIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    // Use AI-generated values
    const initialMRR = financialIntelligence.revenue_model.initial_mrr;
    const baseGrowthRate = financialIntelligence.revenue_model.monthly_growth_rate;
    const averageDealSize = financialIntelligence.revenue_model.average_deal_size;

    // Create three scenarios based on the AI-generated growth rate
    const conservativeRate = baseGrowthRate * 0.67; // 33% lower than base
    const realisticRate = baseGrowthRate; // Use AI-generated rate
    const optimisticRate = baseGrowthRate * 1.33; // 33% higher than base

    for (let i = 0; i < 12; i++) {
      const conservative = Math.round(initialMRR * Math.pow(1 + conservativeRate, i));
      const realistic = Math.round(initialMRR * Math.pow(1 + realisticRate, i));
      const optimistic = Math.round(initialMRR * Math.pow(1 + optimisticRate, i));

      data.push({
        month: months[i],
        conservative: conservative,
        realistic: realistic,
        optimistic: optimistic
      });
    }

    return {
      monthly_data: data,
      year_end_projections: {
        conservative: {
          mrr: data[11].conservative,
          arr: data[11].conservative * 12,
          customers: Math.round(data[11].conservative / averageDealSize)
        },
        realistic: {
          mrr: data[11].realistic,
          arr: data[11].realistic * 12,
          customers: Math.round(data[11].realistic / averageDealSize)
        },
        optimistic: {
          mrr: data[11].optimistic,
          arr: data[11].optimistic * 12,
          customers: Math.round(data[11].optimistic / averageDealSize)
        }
      }
    };
  }

  // Generate expense breakdown for pie chart
  generateExpenseBreakdown(analysis, financialIntelligence) {
    // Use AI-generated burn rate
    const monthlyBurnRate = financialIntelligence.costs.monthly_burn_rate;
    const annualBurnRate = monthlyBurnRate * 12;

    // Calculate breakdown based on typical SaaS expense ratios
    const engineeringPct = 0.36;
    const marketingPct = 0.27;
    const salariesPct = 0.23;
    const operationsPct = 0.14;

    const engineeringMonthly = Math.round(monthlyBurnRate * engineeringPct);
    const marketingMonthly = Math.round(monthlyBurnRate * marketingPct);
    const salariesMonthly = Math.round(monthlyBurnRate * salariesPct);
    const operationsMonthly = Math.round(monthlyBurnRate * operationsPct);

    return {
      categories: [
        {
          name: 'Engineering & Product',
          amount: engineeringMonthly * 12,
          monthly: engineeringMonthly,
          percentage: parseFloat((engineeringPct * 100).toFixed(1))
        },
        {
          name: 'Sales & Marketing',
          amount: marketingMonthly * 12,
          monthly: marketingMonthly,
          percentage: parseFloat((marketingPct * 100).toFixed(1))
        },
        {
          name: 'Founder Salaries',
          amount: salariesMonthly * 12,
          monthly: salariesMonthly,
          percentage: parseFloat((salariesPct * 100).toFixed(1))
        },
        {
          name: 'Operations & Infrastructure',
          amount: operationsMonthly * 12,
          monthly: operationsMonthly,
          percentage: parseFloat((operationsPct * 100).toFixed(1))
        }
      ],
      total_annual: annualBurnRate,
      total_monthly: monthlyBurnRate,
      breakdown_details: {
        engineering: {
          engineers: Math.round(engineeringMonthly * 12 * 0.875),
          product_manager: Math.round(engineeringMonthly * 12 * 0.10),
          tools: Math.round(engineeringMonthly * 12 * 0.025)
        },
        marketing: {
          paid_ads: Math.round(marketingMonthly * 12 * 0.40),
          content: Math.round(marketingMonthly * 12 * 0.20),
          tools: Math.round(marketingMonthly * 12 * 0.10),
          events: Math.round(marketingMonthly * 12 * 0.30)
        },
        operations: {
          hosting: Math.round(operationsMonthly * 12 * 0.30),
          software: Math.round(operationsMonthly * 12 * 0.40),
          legal_accounting: Math.round(operationsMonthly * 12 * 0.30)
        }
      }
    };
  }

  // Generate burn rate and runway data
  generateBurnRateRunway(analysis, financialIntelligence) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];

    // Use AI-generated values
    const initialCash = financialIntelligence.costs.initial_funding;
    const monthlyBurnRate = financialIntelligence.costs.monthly_burn_rate;
    const initialMRR = financialIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = financialIntelligence.revenue_model.monthly_growth_rate;
    const breakEvenMonth = financialIntelligence.runway.months_to_break_even;

    let cash = initialCash;

    for (let i = 0; i < 24; i++) { // 24 months projection
      const monthIndex = i % 12;

      // Revenue grows based on AI-generated growth rate
      const revenue = Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, i));
      const expenses = monthlyBurnRate;
      const burn = expenses - revenue;

      cash += revenue - expenses;

      if (i < 12) {
        data.push({
          month: months[monthIndex],
          period: i + 1,
          revenue: revenue,
          expenses: expenses,
          burn_rate: burn > 0 ? burn : 0,
          cash_balance: Math.round(cash),
          runway_months: cash > 0 ? Math.round(cash / (burn > 0 ? burn : 1)) : 0,
          is_projection: i > 11
        });
      }
    }

    return {
      monthly_data: data,
      key_metrics: {
        initial_cash: initialCash,
        current_burn_rate: monthlyBurnRate,
        average_burn_rate: Math.round(data.slice(0, 6).reduce((sum, m) => sum + m.burn_rate, 0) / 6),
        runway_remaining: data[11].runway_months,
        break_even_month: breakEvenMonth
      }
    };
  }

  // Generate profitability timeline
  generateProfitabilityTimeline(analysis, financialIntelligence) {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 Y2', 'Q2 Y2', 'Q3 Y2', 'Q4 Y2'];
    const data = [];

    // Use AI-generated values
    const initialMRR = financialIntelligence.revenue_model.initial_mrr;
    const monthlyGrowthRate = financialIntelligence.revenue_model.monthly_growth_rate;
    const monthlyBurnRate = financialIntelligence.costs.monthly_burn_rate;
    const breakEvenMonth = financialIntelligence.runway.months_to_break_even;
    const grossMarginPct = financialIntelligence.growth_metrics.gross_margin_percentage;

    // Calculate quarterly projections
    for (let i = 0; i < 8; i++) {
      const startMonth = i * 3;
      const endMonth = startMonth + 2;

      // Calculate quarterly revenue (sum of 3 months)
      let quarterRevenue = 0;
      for (let m = startMonth; m <= endMonth; m++) {
        quarterRevenue += Math.round(initialMRR * Math.pow(1 + monthlyGrowthRate, m));
      }

      // Quarterly expenses (3 months of burn)
      const quarterExpenses = monthlyBurnRate * 3;

      const profit = quarterRevenue - quarterExpenses;
      const margin = quarterRevenue > 0 ? ((profit / quarterRevenue) * 100).toFixed(1) : '0.0';

      data.push({
        quarter: quarters[i],
        revenue: quarterRevenue,
        expenses: quarterExpenses,
        profit: profit,
        profit_margin: parseFloat(margin),
        break_even: profit >= 0
      });
    }

    // Determine break-even quarter
    const breakEvenQuarter = Math.ceil(breakEvenMonth / 3);
    const breakEvenQuarterName = breakEvenQuarter <= 4
      ? `Q${breakEvenQuarter}`
      : `Q${breakEvenQuarter - 4} Y2`;

    // Find first profitable quarter
    const firstProfitableQuarter = data.find(q => q.break_even);
    const positiveMerginQuarter = data.find(q => q.profit_margin > 10);

    return {
      quarterly_data: data,
      milestones: {
        break_even_quarter: firstProfitableQuarter ? firstProfitableQuarter.quarter : breakEvenQuarterName,
        positive_margin_quarter: positiveMerginQuarter ? positiveMerginQuarter.quarter : 'Q4 Y2',
        target_margin: Math.round(grossMarginPct * 100) + '%',
        current_trajectory: `On track for profitability by month ${breakEvenMonth}`
      }
    };
  }
}

module.exports = FinanceAgent;
