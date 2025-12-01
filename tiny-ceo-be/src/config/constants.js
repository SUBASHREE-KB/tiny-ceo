// Application Constants

const APP_CONFIG = {
  name: 'Tiny CEO',
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'tiny-ceo-secret-key',
  jwtExpiry: '7d',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000']
};

const ERROR_MESSAGES = {
  // Auth errors
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',

  // Workspace errors
  WORKSPACE_NOT_FOUND: 'Workspace not found',
  WORKSPACE_CREATE_FAILED: 'Failed to create workspace',

  // Conversation errors
  NO_CONVERSATION: 'No conversation found',
  MESSAGE_REQUIRED: 'Message is required',

  // Agent errors
  AGENT_GENERATION_FAILED: 'Failed to generate agent insights',
  AGENT_NOT_FOUND: 'Agent not found',
  INVALID_AGENT_TYPE: 'Invalid agent type',

  // General errors
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  REQUIRED_FIELD: (field) => `${field} is required`
};

const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  WORKSPACE_CREATED: 'Workspace created successfully',
  MESSAGE_SENT: 'Message sent successfully',
  AGENTS_GENERATED: 'Agents generated successfully',
  AGENT_REGENERATED: 'Agent regenerated successfully'
};

const AGENT_TYPES = [
  'ceo',
  'developer',
  'finance',
  'marketing',
  'sales',
  'overview'
];

const CONVERSATION_CONTEXT = {
  MIN_MESSAGES_FOR_GENERATION: 4, // Minimum messages before allowing agent generation
  MAX_CONVERSATION_LENGTH: 100 // Max messages to keep in history
};

// Industry database for intelligent fallbacks
const INDUSTRIES = {
  'saas': {
    name: 'B2B SaaS',
    tam: '$500B',
    growth_rate: '15-20% YoY',
    typical_pricing: '$19-$199/mo',
    avg_ltv_cac: '3-5x',
    common_competitors: ['Established enterprise players', 'New AI-powered startups']
  },
  'fintech': {
    name: 'FinTech',
    tam: '$300B',
    growth_rate: '12-18% YoY',
    typical_pricing: 'Transaction fees 1-3%',
    avg_ltv_cac: '4-6x',
    common_competitors: ['Traditional banks', 'Digital-first challengers']
  },
  'healthcare': {
    name: 'Healthcare',
    tam: '$400B',
    growth_rate: '8-12% YoY',
    typical_pricing: 'Subscription or per-visit',
    avg_ltv_cac: '5-8x',
    common_competitors: ['Legacy healthcare systems', 'Telehealth platforms']
  },
  'ecommerce': {
    name: 'E-Commerce',
    tam: '$5T',
    growth_rate: '10-15% YoY',
    typical_pricing: 'Marketplace commission 10-20%',
    avg_ltv_cac: '2-4x',
    common_competitors: ['Amazon', 'Niche marketplaces', 'DTC brands']
  },
  'ai': {
    name: 'AI/ML',
    tam: '$200B',
    growth_rate: '35-40% YoY',
    typical_pricing: 'API calls or subscription',
    avg_ltv_cac: '4-7x',
    common_competitors: ['OpenAI', 'Google AI', 'Specialized AI tools']
  },
  'edtech': {
    name: 'Education Technology',
    tam: '$250B',
    growth_rate: '16-20% YoY',
    typical_pricing: '$9-$99/mo per student',
    avg_ltv_cac: '3-5x',
    common_competitors: ['Traditional education', 'Online course platforms']
  },
  'martech': {
    name: 'Marketing Technology',
    tam: '$150B',
    growth_rate: '12-17% YoY',
    typical_pricing: '$49-$499/mo',
    avg_ltv_cac: '4-6x',
    common_competitors: ['HubSpot', 'Salesforce', 'Niche tools']
  }
};

// Tech stack recommendations by use case
const TECH_STACKS = {
  'web_app': {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
    infrastructure: ['AWS/GCP', 'Docker', 'GitHub Actions']
  },
  'ai_product': {
    frontend: ['React', 'Next.js', 'TypeScript', 'Recharts'],
    backend: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'OpenAI API'],
    infrastructure: ['AWS', 'Docker', 'Kubernetes', 'Vector DB']
  },
  'mobile_app': {
    frontend: ['React Native', 'Expo', 'TypeScript'],
    backend: ['Node.js', 'Express', 'MongoDB', 'Firebase'],
    infrastructure: ['AWS', 'App Store/Play Store', 'Firebase Cloud']
  },
  'marketplace': {
    frontend: ['React', 'Next.js', 'TypeScript', 'Stripe Elements'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Stripe API'],
    infrastructure: ['AWS', 'Docker', 'CDN', 'Payment processing']
  }
};

module.exports = {
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  AGENT_TYPES,
  CONVERSATION_CONTEXT,
  INDUSTRIES,
  TECH_STACKS
};
