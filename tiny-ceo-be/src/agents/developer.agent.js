const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');
const { TECH_STACKS } = require('../config/constants');

/**
 * Developer Agent
 * Handles tech stack, architecture, MVP planning, and technical strategy
 */
class DeveloperAgent extends BaseAgent {
  constructor() {
    super(
      'Developer',
      'Technical Architect & CTO Advisor',
      [
        'Tech stack recommendations',
        'System architecture design',
        'MVP scoping and prioritization',
        'Development timeline estimation',
        'Technical risk assessment',
        'Scalability planning'
      ]
    );
  }

  async analyze(conversationAnalysis) {
    logger.agent('Developer', 'Starting technical analysis');

    const aiService = require('../services/ai.service');

    try {
      const instructions = `Generate a comprehensive technical/developer analysis with the following JSON structure:
{
  "tech_stack": {
    "frontend": ["string (technology names)"],
    "backend": ["string (technology names)"],
    "database": "string",
    "infrastructure": ["string (hosting/deployment platforms)"],
    "rationale": "string (why this stack fits)"
  },
  "architecture": {
    "pattern": "string (e.g., microservices, monolith, serverless)",
    "components": ["string (main system components)"],
    "data_flow": "string (how data flows through system)",
    "scalability": "string (how it scales)"
  },
  "mvp_features": [
    {
      "feature": "string",
      "priority": "P0|P1|P2",
      "complexity": "High|Medium|Low",
      "description": "string"
    }
  ],
  "timeline": {
    "total_weeks": number,
    "phases": [
      {
        "phase": "string",
        "duration": "string",
        "deliverables": ["string"]
      }
    ]
  },
  "technical_risks": [
    {
      "risk": "string",
      "severity": "High|Medium|Low",
      "mitigation": "string"
    }
  ],
  "team_requirements": {
    "roles": ["string (required roles)"],
    "ideal_team_size": "string"
  }
}

Base your analysis on the actual startup product/solution described. Recommend specific technologies that fit THIS use case.`;

      const insights = await aiService.generateAgentAnalysis('developer', conversationAnalysis, instructions);

      if (insights.error) {
        logger.warn('Developer AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis);
      }

      logger.agent('Developer', 'Technical analysis completed');
      return insights;
    } catch (error) {
      logger.error('Developer analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis);
    }
  }

  generateTemplateInsights(conversationAnalysis) {
    const { fullText = '' } = conversationAnalysis;
    const productType = this.detectProductType(fullText);
    const hasAI = fullText.toLowerCase().includes('ai') || fullText.toLowerCase().includes('machine learning');
    const hasRealtime = fullText.toLowerCase().includes('real-time') || fullText.toLowerCase().includes('realtime');

    return {
      tech_stack: this.recommendTechStack(productType, hasAI, hasRealtime),
      architecture: this.designArchitecture(productType, hasAI),
      mvp_features: this.scopeMVPFeatures(conversationAnalysis),
      timeline: this.estimateTimeline(productType, hasAI),
      technical_risks: this.identifyTechnicalRisks(productType, hasAI, hasRealtime),
      scalability_plan: this.planScalability(productType),
      development_phases: this.planDevelopmentPhases(productType)
    };
  }

  detectProductType(text) {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('marketplace')) return 'marketplace';
    if (lowerText.includes('mobile') || lowerText.includes('app')) return 'mobile_app';
    if (lowerText.includes('ai') || lowerText.includes('ml')) return 'ai_product';
    return 'web_app';
  }

  recommendTechStack(productType, hasAI, hasRealtime) {
    const baseStack = TECH_STACKS[productType] || TECH_STACKS.web_app;

    const recommendation = {
      frontend: {
        primary: baseStack.frontend[0],
        framework: baseStack.frontend[1],
        language: baseStack.frontend[2],
        styling: baseStack.frontend[3],
        additional: hasRealtime ? ['Socket.io client', 'React Query'] : ['React Query', 'SWR'],
        reasoning: 'Modern, performant stack with excellent developer experience and ecosystem'
      },
      backend: {
        runtime: baseStack.backend[0],
        framework: baseStack.backend[1],
        database: baseStack.backend[2],
        caching: baseStack.backend[3],
        additional: hasAI ? ['Python/FastAPI for AI services', 'OpenAI SDK', 'Vector DB'] : [],
        reasoning: 'Scalable, well-documented, large talent pool'
      },
      infrastructure: {
        hosting: baseStack.infrastructure[0],
        containers: baseStack.infrastructure[1],
        ci_cd: baseStack.infrastructure[2],
        monitoring: ['DataDog / Sentry', 'LogRocket / FullStory'],
        reasoning: 'Production-ready, scales automatically, good free tiers'
      },
      ai_ml: hasAI ? {
        primary_provider: 'OpenAI GPT-4',
        alternatives: ['Anthropic Claude', 'Open-source models via HuggingFace'],
        vector_db: 'Pinecone or Weaviate',
        ml_ops: 'Weights & Biases',
        reasoning: 'Best-in-class AI capabilities, easy integration'
      } : null,
      realtime: hasRealtime ? {
        technology: 'WebSockets via Socket.io',
        alternatives: ['Server-Sent Events', 'WebRTC for P2P'],
        infrastructure: 'Redis for pub/sub',
        reasoning: 'Reliable, scalable real-time communication'
      } : null,
      development_tools: [
        'Git + GitHub for version control',
        'VS Code or Cursor as IDE',
        'Postman for API testing',
        'ESLint + Prettier for code quality',
        'Jest + React Testing Library for tests'
      ]
    };

    return recommendation;
  }

  designArchitecture(productType, hasAI) {
    const architectures = {
      web_app: {
        pattern: 'Monolithic to start, modular internally',
        diagram_description: 'Client (React) -> Load Balancer -> API Server (Node.js) -> PostgreSQL + Redis',
        components: [
          {
            name: 'Frontend Application',
            technology: 'React + Next.js',
            responsibilities: ['User interface', 'Client-side routing', 'State management', 'API calls']
          },
          {
            name: 'API Server',
            technology: 'Node.js + Express',
            responsibilities: ['Business logic', 'Authentication', 'Data validation', 'Database operations']
          },
          {
            name: 'Database',
            technology: 'PostgreSQL',
            responsibilities: ['Persistent data storage', 'Relational data', 'ACID transactions']
          },
          {
            name: 'Cache Layer',
            technology: 'Redis',
            responsibilities: ['Session storage', 'Caching frequent queries', 'Rate limiting']
          }
        ],
        communication: 'RESTful API with JSON payloads',
        scalability_path: 'Start with single server, add horizontal scaling via load balancer as needed'
      },
      ai_product: {
        pattern: 'Microservices (Node.js API + Python AI Service)',
        diagram_description: 'Client -> API Gateway -> Node.js API <-> Python AI Service -> Vector DB',
        components: [
          {
            name: 'Frontend',
            technology: 'React + Next.js',
            responsibilities: ['UI/UX', 'Real-time updates', 'Streaming responses']
          },
          {
            name: 'API Gateway',
            technology: 'Node.js + Express',
            responsibilities: ['Authentication', 'Rate limiting', 'Request routing']
          },
          {
            name: 'AI Service',
            technology: 'Python + FastAPI',
            responsibilities: ['LLM interactions', 'Vector embeddings', 'Model orchestration']
          },
          {
            name: 'Vector Database',
            technology: 'Pinecone',
            responsibilities: ['Embedding storage', 'Semantic search', 'Context retrieval']
          },
          {
            name: 'Primary Database',
            technology: 'PostgreSQL',
            responsibilities: ['User data', 'Conversation history', 'Metadata']
          }
        ],
        communication: 'REST + gRPC for internal services, WebSocket for streaming',
        scalability_path: 'Independent scaling of AI service, queue-based job processing for heavy workloads'
      },
      marketplace: {
        pattern: 'Monolithic with service modules',
        components: [
          {
            name: 'User Service',
            responsibilities: ['Authentication', 'User profiles', 'Permissions']
          },
          {
            name: 'Listing Service',
            responsibilities: ['Product/service listings', 'Search', 'Categories']
          },
          {
            name: 'Transaction Service',
            responsibilities: ['Orders', 'Payments', 'Escrow', 'Disputes']
          },
          {
            name: 'Messaging Service',
            responsibilities: ['Buyer-seller communication', 'Notifications']
          },
          {
            name: 'Payment Integration',
            technology: 'Stripe Connect',
            responsibilities: ['Payment processing', 'Payouts', 'Commission handling']
          }
        ],
        communication: 'RESTful API + WebSocket for messaging',
        scalability_path: 'Database sharding by geography, CDN for static assets'
      }
    };

    const architecture = architectures[productType] || architectures.web_app;

    return {
      ...architecture,
      security_considerations: [
        'HTTPS/TLS for all communications',
        'JWT tokens with short expiry + refresh tokens',
        'Input validation and sanitization',
        'SQL injection prevention (parameterized queries)',
        'XSS protection',
        'CSRF tokens for state-changing operations',
        'Rate limiting to prevent abuse',
        'Regular dependency updates'
      ],
      data_flow: [
        'User action triggers frontend event',
        'Frontend makes authenticated API request',
        'API validates request and checks permissions',
        'Business logic processes request',
        'Database operations via ORM/query builder',
        'Response formatted and returned to frontend',
        'Frontend updates UI based on response'
      ]
    };
  }

  scopeMVPFeatures(analysis) {
    const { solution, targetAudience } = analysis;

    return [
      {
        feature: 'User Authentication & Onboarding',
        priority: 'Critical',
        effort: '2 weeks',
        description: 'Email/password auth, OAuth options (Google), email verification, guided onboarding flow',
        acceptance_criteria: [
          'Users can sign up with email/password',
          'Email verification works',
          'Forgot password flow functional',
          'Onboarding completes in <2 minutes'
        ],
        technical_notes: 'Use Passport.js or Auth0 for quick implementation'
      },
      {
        feature: `Core Value Feature: ${solution.substring(0, 50)}`,
        priority: 'Critical',
        effort: '3-4 weeks',
        description: 'The primary feature that delivers your unique value proposition to users',
        acceptance_criteria: [
          'Solves the core problem identified',
          'Works reliably for happy path',
          'Performance acceptable (< 2s response time)',
          'Error states handled gracefully'
        ],
        technical_notes: 'Focus on the 20% of features that deliver 80% of value'
      },
      {
        feature: 'Dashboard & Analytics',
        priority: 'High',
        effort: '1.5 weeks',
        description: 'User dashboard showing key metrics, activity, and insights relevant to their goals',
        acceptance_criteria: [
          'Dashboard loads in <1 second',
          'Shows 4-6 key metrics',
          'Data visualizations are clear',
          'Responsive on mobile'
        ],
        technical_notes: 'Use Recharts or Chart.js for visualizations'
      },
      {
        feature: 'Payment Integration',
        priority: 'High',
        effort: '1 week',
        description: 'Stripe integration for subscription billing, handle upgrades/downgrades, invoice generation',
        acceptance_criteria: [
          'Users can subscribe to paid plans',
          'Webhooks handle subscription events',
          'Failed payments trigger alerts',
          'Invoices auto-generated'
        ],
        technical_notes: 'Stripe Checkout for fastest implementation, Stripe Billing for subscriptions'
      },
      {
        feature: 'Settings & Preferences',
        priority: 'Medium',
        effort: '1 week',
        description: 'User settings, notification preferences, account management, billing history',
        acceptance_criteria: [
          'Users can update profile',
          'Email preferences saveable',
          'Can view billing history',
          'Account deletion works'
        ]
      },
      {
        feature: 'Admin Panel',
        priority: 'Medium',
        effort: '1 week',
        description: 'Internal tool for managing users, viewing metrics, handling support issues',
        acceptance_criteria: [
          'Can view all users and key stats',
          'Can impersonate users for debugging',
          'System health metrics visible',
          'Access control for admin users'
        ],
        technical_notes: 'Use React Admin or Retool for quick admin panel'
      }
    ];
  }

  estimateTimeline(productType, hasAI) {
    const baseWeeks = productType === 'ai_product' ? 12 : 10;

    return {
      total_weeks: baseWeeks,
      total_months: Math.ceil(baseWeeks / 4),
      confidence: '70% - assumes experienced developers',
      assumptions: [
        'Team of 2 full-time developers',
        'Design work happening in parallel or using templates',
        'Third-party services for auth, payments, etc.',
        'No major scope changes during development',
        'Testing and bug fixing included'
      ],
      sprints: [
        {
          sprint: 'Sprint 1-2',
          weeks: '1-4',
          focus: 'Foundation & Setup',
          deliverables: [
            'Project structure and repository setup',
            'Database schema design and migrations',
            'Authentication system implemented',
            'Basic UI framework and component library',
            'Development environment configured'
          ],
          team_composition: '2 developers'
        },
        {
          sprint: 'Sprint 3-4',
          weeks: '5-8',
          focus: 'Core Features',
          deliverables: [
            'Main product features developed',
            'API integrations completed',
            'Dashboard and analytics implemented',
            'Payment integration configured',
            'Initial testing and bug fixes'
          ],
          team_composition: '2 developers + 1 designer (part-time)'
        },
        {
          sprint: 'Sprint 5',
          weeks: '9-' + baseWeeks,
          focus: 'Polish & Launch',
          deliverables: [
            'Edge cases handled',
            'Performance optimization',
            'Security audit and fixes',
            'Production deployment',
            'Monitoring and alerting setup',
            'Documentation completed'
          ],
          team_composition: '2 developers + QA testing'
        }
      ],
      post_mvp: 'Plan for 2-4 weeks of iteration based on initial user feedback'
    };
  }

  identifyTechnicalRisks(productType, hasAI, hasRealtime) {
    const risks = [
      {
        risk: 'Scope creep delaying MVP launch',
        probability: 'High',
        impact: 'High',
        mitigation: [
          'Ruthlessly prioritize must-have vs nice-to-have features',
          'Create clear MVP scope document',
          'Defer all non-essential features to v2',
          'Regular scope reviews with stakeholders'
        ]
      },
      {
        risk: 'Technical debt accumulating in rush to launch',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: [
          'Follow code review process',
          'Write tests for critical paths',
          'Document architectural decisions',
          'Allocate 20% time for refactoring'
        ]
      },
      {
        risk: 'Third-party API dependencies causing failures',
        probability: 'Medium',
        impact: 'High',
        mitigation: [
          'Implement retry logic with exponential backoff',
          'Add circuit breakers for external services',
          'Monitor API health and set up alerts',
          'Have fallback options where possible'
        ]
      },
      {
        risk: 'Security vulnerabilities',
        probability: 'Medium',
        impact: 'Critical',
        mitigation: [
          'Follow OWASP top 10 guidelines',
          'Regular security audits',
          'Keep dependencies updated',
          'Use automated security scanning tools',
          'Implement proper input validation'
        ]
      }
    ];

    if (hasAI) {
      risks.push({
        risk: 'AI API costs higher than expected',
        probability: 'Medium',
        impact: 'High',
        mitigation: [
          'Implement aggressive caching',
          'Set rate limits per user',
          'Monitor token usage closely',
          'Consider smaller models for simple tasks',
          'Implement cost alerts'
        ]
      });
    }

    if (hasRealtime) {
      risks.push({
        risk: 'WebSocket connection issues at scale',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: [
          'Use managed WebSocket service (AWS API Gateway, Pusher)',
          'Implement reconnection logic',
          'Load test early',
          'Have fallback to polling'
        ]
      });
    }

    return risks;
  }

  planScalability(productType) {
    return {
      current_phase: 'MVP - Optimized for speed to market',
      scaling_triggers: [
        {
          metric: '1,000 active users',
          action: 'Add caching layer, optimize database queries'
        },
        {
          metric: '10,000 active users',
          action: 'Horizontal scaling with load balancer, CDN for static assets'
        },
        {
          metric: '100,000 active users',
          action: 'Database replication, microservices for heavy components'
        }
      ],
      architecture_evolution: [
        {
          phase: 'Phase 1 (MVP)',
          architecture: 'Single server monolith',
          handles: '0-1,000 users',
          monthly_cost: '$100-300'
        },
        {
          phase: 'Phase 2 (Early Growth)',
          architecture: 'Separated frontend/backend, managed database',
          handles: '1,000-10,000 users',
          monthly_cost: '$500-1,500'
        },
        {
          phase: 'Phase 3 (Scale)',
          architecture: 'Multi-region, load balanced, auto-scaling',
          handles: '10,000-100,000+ users',
          monthly_cost: '$2,000-10,000+'
        }
      ],
      performance_targets: {
        api_response_time: '< 200ms p95',
        page_load_time: '< 2 seconds',
        uptime: '99.9%',
        error_rate: '< 0.1%'
      }
    };
  }

  planDevelopmentPhases(productType) {
    return {
      phase_1: {
        name: 'Setup & Foundation',
        duration: '1-2 weeks',
        outputs: ['Repository setup', 'CI/CD pipeline', 'Database schema', 'Auth system']
      },
      phase_2: {
        name: 'Core Development',
        duration: '4-6 weeks',
        outputs: ['Core features', 'API endpoints', 'Frontend components', 'Integrations']
      },
      phase_3: {
        name: 'Polish & Testing',
        duration: '2-3 weeks',
        outputs: ['Bug fixes', 'Performance optimization', 'Security hardening', 'Documentation']
      },
      phase_4: {
        name: 'Launch & Iteration',
        duration: 'Ongoing',
        outputs: ['Production deployment', 'User feedback integration', 'Feature iterations']
      }
    };
  }
}

module.exports = DeveloperAgent;
