// AI Configuration
// Supports OpenAI, Anthropic, Gemini, or intelligent fallback mode

const AI_CONFIG = {
  // AI Provider: 'openai', 'anthropic', 'gemini', or 'fallback'
  provider: process.env.AI_PROVIDER || 'fallback',

  // API Keys
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
    temperature: 0.7,
    maxTokens: 2000
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
    temperature: 0.7,
    maxTokens: 2000
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000
  },

  // Fallback mode uses intelligent pattern matching and analysis
  fallback: {
    enabled: true,
    useIntelligentResponses: true
  }
};

// Search Configuration
const SEARCH_CONFIG = {
  // Search Provider: 'serpapi', 'brave', 'google', or 'fallback'
  provider: process.env.SEARCH_PROVIDER || 'fallback',

  serpapi: {
    apiKey: process.env.SERPAPI_KEY || '',
    engine: 'google',
    num: 10
  },

  brave: {
    apiKey: process.env.BRAVE_SEARCH_KEY || '',
    count: 10
  },

  google: {
    apiKey: process.env.GOOGLE_SEARCH_KEY || '',
    cx: process.env.GOOGLE_SEARCH_CX || '',
    num: 10
  },

  // Fallback mode uses intelligent mock data based on industry/query
  fallback: {
    enabled: true,
    useIntelligentMocks: true
  }
};

// Agent Configuration
const AGENT_CONFIG = {
  agents: {
    ceo: {
      name: 'CEO Strategy Agent',
      role: 'Chief Executive Officer',
      capabilities: [
        'Competitive analysis',
        'Market trend analysis',
        'Fundraising strategy',
        'Growth roadmap',
        'Risk assessment'
      ]
    },
    developer: {
      name: 'Developer Agent',
      role: 'Technical Architect',
      capabilities: [
        'Tech stack recommendations',
        'Architecture design',
        'MVP scope analysis',
        'Timeline estimation',
        'Technical risk identification'
      ]
    },
    finance: {
      name: 'Finance Agent',
      role: 'Chief Financial Officer',
      capabilities: [
        'Pricing strategy',
        'Revenue projections',
        'Unit economics',
        'Budget planning',
        'Breakeven analysis'
      ]
    },
    marketing: {
      name: 'Marketing Agent',
      role: 'Chief Marketing Officer',
      capabilities: [
        'Market size estimation',
        'Competitive positioning',
        'Go-to-market strategy',
        'Content strategy',
        'Brand positioning'
      ]
    },
    sales: {
      name: 'Sales Agent',
      role: 'Chief Revenue Officer',
      capabilities: [
        'ICP definition',
        'Lead generation strategy',
        'Sales playbook creation',
        'Objection handling',
        'Sales metrics'
      ]
    },
    overview: {
      name: 'Overview Agent',
      role: 'Executive Advisor',
      capabilities: [
        'Executive summary',
        'Opportunity scoring',
        'Quick wins',
        'Risk prioritization',
        'Action planning'
      ]
    }
  }
};

module.exports = {
  AI_CONFIG,
  SEARCH_CONFIG,
  AGENT_CONFIG
};
