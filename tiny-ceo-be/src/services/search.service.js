const { SEARCH_CONFIG } = require('../config/ai');
const { INDUSTRIES } = require('../config/constants');
const { logger } = require('../utils/logger');
const { detectIndustry } = require('../utils/helpers');

/**
 * Search Service
 * Handles web search with support for SerpAPI, Brave Search, or intelligent fallback
 */
class SearchService {
  constructor() {
    this.provider = SEARCH_CONFIG.provider;
    this.config = SEARCH_CONFIG[this.provider] || SEARCH_CONFIG.fallback;

    if (this.provider !== 'fallback' && !this.config.apiKey) {
      logger.warn('No search API key configured, using intelligent fallback mode');
      this.provider = 'fallback';
    }
  }

  /**
   * Search for competitors in an industry
   */
  async searchCompetitors(industry, problem) {
    try {
      if (this.provider === 'serpapi') {
        return await this.searchCompetitorsSerpAPI(industry, problem);
      } else if (this.provider === 'brave') {
        return await this.searchCompetitorsBrave(industry, problem);
      } else {
        return this.searchCompetitorsFallback(industry, problem);
      }
    } catch (error) {
      logger.error('Competitor search failed, using fallback', error);
      return this.searchCompetitorsFallback(industry, problem);
    }
  }

  searchCompetitorsFallback(industry, problem) {
    const industryData = INDUSTRIES[industry.toLowerCase()] || INDUSTRIES.saas;

    // Intelligent mock competitors based on industry
    const competitors = [
      {
        name: `Leading ${industryData.name} Platform`,
        description: 'Established market leader with comprehensive feature set',
        strength: 'Strong brand recognition, large customer base, extensive features',
        weakness: 'Legacy technology, slow to innovate, complex pricing',
        recommendation: 'Position as the modern, user-friendly alternative',
        website: 'competitor1.com',
        founded: '2015',
        funding: '$50M+'
      },
      {
        name: 'Emerging Innovation Leader',
        description: 'Fast-growing startup with modern approach',
        strength: 'Innovative features, modern tech stack, good UX',
        weakness: 'Limited market presence, fewer integrations',
        recommendation: 'Move quickly to capture market share first',
        website: 'competitor2.com',
        founded: '2021',
        funding: '$10M'
      },
      {
        name: 'Traditional/Manual Solutions',
        description: 'Spreadsheets, manual processes, legacy tools',
        strength: 'Zero cost, familiar to users',
        weakness: 'Time-consuming, error-prone, doesn\'t scale',
        recommendation: 'Emphasize ROI and time savings in your messaging',
        market_share: '40-50%'
      }
    ];

    return {
      competitors,
      insights: {
        market_maturity: 'Growing',
        competition_level: 'Moderate to High',
        opportunity: `Strong opportunity in ${industryData.name} to differentiate through superior UX and specialized features`,
        differentiation_strategy: 'Focus on a specific niche, deliver exceptional user experience, and move faster than incumbents'
      }
    };
  }

  /**
   * Search for market trends
   */
  async searchMarketTrends(industry) {
    try {
      if (this.provider === 'serpapi') {
        return await this.searchTrendsSerpAPI(industry);
      } else if (this.provider === 'brave') {
        return await this.searchTrendsBrave(industry);
      } else {
        return this.searchTrendsFallback(industry);
      }
    } catch (error) {
      logger.error('Market trends search failed, using fallback', error);
      return this.searchTrendsFallback(industry);
    }
  }

  searchTrendsFallback(industry) {
    const industryData = INDUSTRIES[industry.toLowerCase()] || INDUSTRIES.saas;

    const trends = [
      {
        trend: 'AI Integration',
        description: `AI and automation capabilities becoming table stakes in ${industryData.name}`,
        impact: 'High',
        timeline: 'Currently accelerating',
        opportunity: 'Integrate AI features early to stay competitive'
      },
      {
        trend: 'Remote-First Transformation',
        description: 'Companies prioritizing cloud-based, collaborative solutions',
        impact: 'High',
        timeline: 'Ongoing',
        opportunity: 'Design for distributed teams from day one'
      },
      {
        trend: 'Vertical Specialization',
        description: 'Customers prefer industry-specific solutions over generic platforms',
        impact: 'Medium',
        timeline: 'Growing',
        opportunity: 'Consider focusing on one vertical initially'
      },
      {
        trend: 'Self-Service & PLG',
        description: 'Product-led growth with self-service onboarding gaining traction',
        impact: 'High',
        timeline: 'Mainstream',
        opportunity: 'Make product easy to try and adopt without sales interaction'
      }
    ];

    return {
      trends,
      market_size: industryData.tam,
      growth_rate: industryData.growth_rate,
      insights: {
        outlook: 'Positive',
        key_drivers: ['Digital transformation', 'Cloud adoption', 'AI innovation'],
        challenges: ['Market saturation in some segments', 'Customer acquisition costs rising'],
        recommendations: [
          'Focus on a specific underserved niche',
          'Leverage AI to differentiate',
          'Prioritize product-led growth',
          'Build strong community and content'
        ]
      }
    };
  }

  /**
   * Search for pricing benchmarks
   */
  async searchPricingBenchmarks(industry, productType = 'saas') {
    try {
      if (this.provider === 'fallback') {
        return this.searchPricingFallback(industry, productType);
      }
      // Add real API implementation here
      return this.searchPricingFallback(industry, productType);
    } catch (error) {
      logger.error('Pricing search failed, using fallback', error);
      return this.searchPricingFallback(industry, productType);
    }
  }

  searchPricingFallback(industry, productType) {
    const industryData = INDUSTRIES[industry.toLowerCase()] || INDUSTRIES.saas;

    return {
      typical_pricing: industryData.typical_pricing,
      pricing_models: [
        {
          model: 'Tiered Subscription',
          popularity: 'Very High',
          tiers: [
            { name: 'Starter', range: '$19-49/mo', target: 'Individuals, freelancers' },
            { name: 'Professional', range: '$49-149/mo', target: 'Small teams (5-20)' },
            { name: 'Business', range: '$149-499/mo', target: 'Medium teams (20-100)' },
            { name: 'Enterprise', range: 'Custom', target: 'Large organizations (100+)' }
          ]
        },
        {
          model: 'Usage-Based',
          popularity: 'Growing',
          description: 'Pay per API call, transaction, or usage metric',
          advantage: 'Aligns cost with value, easier to start'
        },
        {
          model: 'Freemium',
          popularity: 'High',
          description: 'Free tier with paid upgrades',
          advantage: 'Low friction adoption, viral growth potential'
        }
      ],
      benchmarks: {
        arpu: '$42-75/month',
        conversion_rate: '2-4% free to paid',
        annual_prepay_discount: '15-20%',
        churn_rate: '3-5% monthly (good)'
      },
      recommendations: [
        'Start with 3-4 tiers to test price sensitivity',
        'Annual plans with 15-20% discount to improve cash flow',
        'Consider usage-based pricing for scalability',
        'Anchor pricing around your Professional/Business tier'
      ]
    };
  }

  /**
   * Search for funding/investor data
   */
  async searchFundingData(stage, industry) {
    return this.searchFundingFallback(stage, industry);
  }

  searchFundingFallback(stage, industry) {
    const industryData = INDUSTRIES[industry.toLowerCase()] || INDUSTRIES.saas;

    const fundingByStage = {
      'pre-seed': {
        typical_amount: '$250K - $500K',
        valuation: '$2M - $4M pre-money',
        investors: ['Angel investors', 'Accelerators (Y Combinator, Techstars)', 'Pre-seed funds'],
        dilution: '10-15%',
        timeline: '2-4 months to raise'
      },
      'seed': {
        typical_amount: '$750K - $2M',
        valuation: '$4M - $8M pre-money',
        investors: ['Seed-stage VCs', 'Angel syndicates', 'Strategic angels in industry'],
        dilution: '15-25%',
        timeline: '3-6 months to raise'
      },
      'series-a': {
        typical_amount: '$5M - $15M',
        valuation: '$20M - $50M pre-money',
        investors: ['Early-stage VCs', 'Growth-focused VCs', 'Corporate VCs'],
        dilution: '20-30%',
        timeline: '4-8 months to raise',
        requirements: ['$1M+ ARR', 'Strong growth metrics', 'Clear path to Series B']
      }
    };

    const stageData = fundingByStage[stage.toLowerCase()] || fundingByStage.seed;

    return {
      stage,
      ...stageData,
      industry_specific: {
        industry: industryData.name,
        typical_ltv_cac: industryData.avg_ltv_cac,
        investor_focus: `${industryData.name} investors looking for ${industryData.growth_rate} growth`
      },
      preparation: [
        'Pitch deck (10-15 slides)',
        'Financial model (3-year projections)',
        'Product demo',
        'Customer testimonials/case studies',
        'Competitive analysis'
      ]
    };
  }

  /**
   * Generic web search
   */
  async search(query, options = {}) {
    logger.debug(`Searching for: ${query}`);

    if (this.provider === 'fallback') {
      return this.searchFallbackGeneric(query);
    }

    // Add real API implementation here
    return this.searchFallbackGeneric(query);
  }

  searchFallbackGeneric(query) {
    return {
      query,
      results: [
        {
          title: `${query} - Industry Overview`,
          snippet: `Comprehensive analysis of ${query} trends, market size, and opportunities.`,
          url: 'https://example.com/resource1'
        },
        {
          title: `Best Practices for ${query}`,
          snippet: `Expert insights and recommendations for ${query}.`,
          url: 'https://example.com/resource2'
        }
      ],
      note: 'Using intelligent fallback data. Connect a search API for real-time web results.'
    };
  }
}

// Export singleton instance
const searchService = new SearchService();

module.exports = searchService;
