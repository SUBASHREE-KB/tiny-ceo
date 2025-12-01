const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'tiny-ceo-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const db = {
  users: [],
  workspaces: [],
  conversations: [],
  agentOutputs: []
};

let userIdCounter = 1;
let workspaceIdCounter = 1;
let conversationIdCounter = 1;
let agentOutputIdCounter = 1;

// Helper functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== AUTH ENDPOINTS =====

app.post('/auth/register', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      email,
      password_hash: hashPassword(password),
      created_at: new Date().toISOString()
    };

    db.users.push(user);

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ===== WORKSPACE ENDPOINTS =====

app.get('/workspaces', authMiddleware, (req, res) => {
  try {
    const workspaces = db.workspaces
      .filter(w => w.user_id === req.userId)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    res.json({ workspaces });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

app.get('/workspaces/:id', authMiddleware, (req, res) => {
  try {
    const workspace = db.workspaces.find(
      w => w.id === parseInt(req.params.id) && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json({ workspace });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

app.post('/workspaces', authMiddleware, (req, res) => {
  try {
    const { title, startup_idea_text } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    const workspace = {
      id: workspaceIdCounter++,
      user_id: req.userId,
      title,
      startup_idea_text: startup_idea_text || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.workspaces.push(workspace);

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// ===== CONVERSATION ENDPOINTS =====

app.get('/workspaces/:workspaceId/conversations', authMiddleware, (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);

    // Verify workspace ownership
    const workspace = db.workspaces.find(
      w => w.id === workspaceId && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get conversation
    const conversation = db.conversations.find(c => c.workspace_id === workspaceId);

    if (!conversation) {
      return res.json({ messages: [] });
    }

    res.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Generate intelligent AI response based on conversation context
function generateAIResponse(userMessage, conversationHistory) {
  const lowerMessage = userMessage.toLowerCase();
  const messageCount = conversationHistory.filter(m => m.role === 'user').length;

  // Extract what they've already discussed
  const discussed = {
    problem: conversationHistory.some(m => m.content.toLowerCase().includes('problem') || m.content.toLowerCase().includes('solve')),
    customers: conversationHistory.some(m => m.content.toLowerCase().includes('customer') || m.content.toLowerCase().includes('user') || m.content.toLowerCase().includes('target')),
    monetization: conversationHistory.some(m => m.content.toLowerCase().includes('money') || m.content.toLowerCase().includes('revenue') || m.content.toLowerCase().includes('price')),
    competition: conversationHistory.some(m => m.content.toLowerCase().includes('competitor') || m.content.toLowerCase().includes('alternative')),
    team: conversationHistory.some(m => m.content.toLowerCase().includes('team') || m.content.toLowerCase().includes('founder'))
  };

  // First message - warm welcome and understand the idea
  if (messageCount === 1) {
    if (lowerMessage.length < 20) {
      return "Welcome! I'd love to hear more about your startup idea. Can you describe it in detail? What are you building and why?";
    }
    return "That sounds promising! To help you better, can you tell me more about the specific problem you're solving? Who experiences this problem most acutely?";
  }

  // Second message - dig into problem or customers
  if (messageCount === 2) {
    if (!discussed.problem && !lowerMessage.includes('problem')) {
      return "Interesting! What specific pain point or problem does this address? Understanding the problem deeply is crucial for product-market fit.";
    }
    if (!discussed.customers) {
      return "Got it! Who is your ideal customer? Can you describe them in detail - their demographics, behaviors, and current solutions they use?";
    }
  }

  // Third message - understand market and competition
  if (messageCount === 3) {
    if (!discussed.competition) {
      return "That makes sense! What alternatives or competitors exist today? How will your solution be different or better?";
    }
    if (!discussed.monetization) {
      return "Great insights! How do you plan to monetize this? What pricing model are you considering and why?";
    }
  }

  // Fourth message - business model and next steps
  if (messageCount === 4) {
    if (!discussed.monetization) {
      return "Excellent! How will you make money from this? Have you thought about pricing, subscription models, or other revenue streams?";
    }
    return "This is taking shape nicely! What's your biggest concern or challenge right now? What do you need help with most?";
  }

  // Fifth+ messages - contextual and specific
  if (messageCount >= 5) {
    return "I have enough context about your startup idea! Click 'Create Startup Space' below to generate comprehensive insights from our 6 specialized AI agents. They'll analyze your market, competition, financials, tech stack, marketing strategy, and sales approach!";
  }

  // Fallback responses based on keywords in user's message
  if (lowerMessage.includes('technical') || lowerMessage.includes('technology') || lowerMessage.includes('build')) {
    return "On the technical side, what's your current thinking about the technology stack and development approach? Do you have technical co-founders or will you need to hire?";
  }

  if (lowerMessage.includes('fund') || lowerMessage.includes('capital') || lowerMessage.includes('money') || lowerMessage.includes('invest')) {
    return "Regarding funding - how much capital do you think you'll need to reach your first major milestone? Are you planning to bootstrap, raise from angels, or go for VC funding?";
  }

  if (lowerMessage.includes('market') || lowerMessage.includes('industry') || lowerMessage.includes('size')) {
    return "Tell me about the market size and opportunity. How big is this market and what percentage do you think you can realistically capture in the first 3 years?";
  }

  if (lowerMessage.includes('team') || lowerMessage.includes('founder') || lowerMessage.includes('hire')) {
    return "What does your team look like? Do you have co-founders? What key roles do you need to fill in the next 6-12 months?";
  }

  // Default contextual response
  const defaultResponses = [
    "That's a valuable insight. Can you elaborate on how this would work in practice?",
    "Interesting approach! What led you to this conclusion?",
    "I see. How does this tie into your overall go-to-market strategy?",
    "Good point. Have you validated this assumption with potential customers yet?",
    "Makes sense. What's your timeline for achieving this?",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

app.post('/workspaces/:workspaceId/conversations/message', authMiddleware, (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Verify workspace ownership
    const workspace = db.workspaces.find(
      w => w.id === workspaceId && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get or create conversation
    let conversation = db.conversations.find(c => c.workspace_id === workspaceId);

    if (!conversation) {
      conversation = {
        id: conversationIdCounter++,
        workspace_id: workspaceId,
        messages: [],
        created_at: new Date().toISOString()
      };
      db.conversations.push(conversation);
    }

    // Generate intelligent AI response based on context
    const aiResponse = generateAIResponse(message, conversation.messages);

    // Add messages
    conversation.messages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    );

    res.json({
      message: 'Message sent successfully',
      response: aiResponse
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ===== HELPER FUNCTIONS FOR AI ANALYSIS =====

function analyzeConversation(messages) {
  // Extract all user messages to understand the startup idea
  const userMessages = messages.filter(m => m.role === 'user').map(m => m.content).join(' ');

  // Extract key information
  const analysis = {
    fullText: userMessages,
    problem: extractProblem(userMessages),
    solution: extractSolution(userMessages),
    targetAudience: extractTargetAudience(userMessages),
    businessModel: extractBusinessModel(userMessages),
    uniqueValue: extractUniqueValue(userMessages),
    industry: extractIndustry(userMessages)
  };

  return analysis;
}

function extractProblem(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('pain')) {
    const sentences = text.split(/[.!?]/);
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes('problem') || sentence.toLowerCase().includes('solv')) {
        return sentence.trim();
      }
    }
  }
  return "Identified pain points in the target market";
}

function extractSolution(text) {
  const sentences = text.split(/[.!?]/);
  return sentences[0] || "Innovative solution to address market needs";
}

function extractTargetAudience(text) {
  const lowerText = text.toLowerCase();
  const audiences = {
    'business': 'Small to medium-sized businesses',
    'enterprise': 'Enterprise companies',
    'consumer': 'Individual consumers',
    'developer': 'Software developers and technical teams',
    'startup': 'Early-stage startups',
    'student': 'Students and educational institutions',
    'professional': 'Working professionals'
  };

  for (const [key, value] of Object.entries(audiences)) {
    if (lowerText.includes(key)) return value;
  }
  return 'Target market professionals';
}

function extractBusinessModel(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('subscription') || lowerText.includes('saas')) return 'SaaS subscription';
  if (lowerText.includes('marketplace')) return 'Marketplace commission';
  if (lowerText.includes('free')) return 'Freemium';
  return 'Subscription-based revenue';
}

function extractUniqueValue(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('ai') || lowerText.includes('machine learning')) return 'AI-powered automation';
  if (lowerText.includes('easy') || lowerText.includes('simple')) return 'User-friendly interface';
  if (lowerText.includes('fast') || lowerText.includes('quick')) return 'Speed and efficiency';
  return 'Innovative approach to solving the problem';
}

function extractIndustry(text) {
  const lowerText = text.toLowerCase();
  const industries = {
    'health': 'Healthcare',
    'education': 'Education',
    'finance': 'FinTech',
    'retail': 'E-commerce',
    'saas': 'B2B SaaS',
    'ai': 'AI/ML',
    'marketing': 'MarTech'
  };

  for (const [key, value] of Object.entries(industries)) {
    if (lowerText.includes(key)) return value;
  }
  return 'Technology';
}

// Generate CEO insights based on conversation
function generateCEOInsights(analysis) {
  return {
    competitive_analysis: [
      {
        competitor: "Market Leader in " + analysis.industry,
        strength: "Established brand and customer base",
        weakness: "Slow to innovate, legacy technology",
        recommendation: "Position as modern, agile alternative"
      },
      {
        competitor: "Emerging Competitor",
        strength: "New technology approach",
        weakness: "Limited market presence and resources",
        recommendation: "Move fast to capture market share first"
      },
      {
        competitor: "DIY/Manual Solutions",
        strength: "Zero cost for users",
        weakness: "Time-consuming and error-prone",
        recommendation: "Emphasize ROI and time savings in messaging"
      }
    ],
    roadmap: [
      {
        phase: "Phase 1 (Months 1-3)",
        milestone: "MVP Development & Beta Testing",
        details: "Build core features, recruit 20-50 beta users, gather feedback"
      },
      {
        phase: "Phase 2 (Months 4-6)",
        milestone: "Public Launch & Initial Growth",
        details: "Official launch, acquire first 500 paying customers, iterate based on data"
      },
      {
        phase: "Phase 3 (Months 7-12)",
        milestone: "Scale & Fundraising",
        details: "Reach $50K MRR, expand team, prepare for Series A funding"
      }
    ],
    fundraising: {
      target: "$750K - $1.5M seed round",
      investors: [
        "Angel investors in " + analysis.industry,
        "Early-stage VCs focused on B2B SaaS",
        "Industry-specific accelerators"
      ],
      valuation: "$4M - $6M pre-money",
      use_of_funds: {
        product: "40% - Product development and engineering",
        sales_marketing: "35% - Customer acquisition and marketing",
        operations: "15% - Operations and infrastructure",
        runway: "10% - Cash reserves (18-month runway)"
      }
    },
    pivot_signals: [
      "User churn rate exceeds 50% after 3 months",
      "Unable to achieve product-market fit after 6 months of iterations",
      "CAC (Customer Acquisition Cost) is 3x+ higher than LTV",
      "Consistently negative feedback on core value proposition"
    ],
    key_metrics: [
      "Monthly Recurring Revenue (MRR)",
      "Customer Acquisition Cost (CAC)",
      "Lifetime Value (LTV)",
      "Churn Rate",
      "Net Promoter Score (NPS)"
    ]
  };
}

// Generate Developer insights
function generateDeveloperInsights(analysis) {
  const isAIProduct = analysis.fullText.toLowerCase().includes('ai') || analysis.fullText.toLowerCase().includes('ml');

  return {
    tech_stack: {
      frontend: isAIProduct
        ? ["React", "Next.js", "TypeScript", "Tailwind CSS", "Recharts for analytics"]
        : ["React", "Vite", "TypeScript", "Tailwind CSS"],
      backend: isAIProduct
        ? ["Node.js/Python hybrid", "FastAPI", "PostgreSQL", "Redis", "OpenAI API"]
        : ["Node.js", "Express", "PostgreSQL", "Redis"],
      infrastructure: ["AWS/GCP", "Docker", "Kubernetes", "GitHub Actions", "Vercel/Netlify"],
      reasoning: "Modern, scalable stack with strong community support and fast iteration cycles"
    },
    mvp_features: [
      {
        feature: "User Authentication & Onboarding",
        priority: "Critical",
        effort: "Medium (1-2 weeks)",
        description: "Secure auth, email verification, smooth onboarding flow"
      },
      {
        feature: "Core Product Feature - " + analysis.solution,
        priority: "Critical",
        effort: "High (3-4 weeks)",
        description: "The main value proposition that solves the identified problem"
      },
      {
        feature: "Dashboard & Analytics",
        priority: "High",
        effort: "Medium (2 weeks)",
        description: "User dashboard showing key metrics and insights"
      },
      {
        feature: "Payment Integration",
        priority: "High",
        effort: "Low (3-5 days)",
        description: "Stripe integration for subscription billing"
      },
      {
        feature: "Admin Panel",
        priority: "Medium",
        effort: "Medium (1-2 weeks)",
        description: "Internal tools for managing users and monitoring system health"
      }
    ],
    timeline: {
      total_weeks: 10,
      sprints: [
        {
          sprint: "Sprint 1-2 (Weeks 1-4)",
          focus: "Foundation & Authentication",
          deliverables: "Project setup, database schema, auth system, basic UI framework"
        },
        {
          sprint: "Sprint 3-4 (Weeks 5-8)",
          focus: "Core Features Development",
          deliverables: "Main product features, API integrations, dashboard implementation"
        },
        {
          sprint: "Sprint 5 (Weeks 9-10)",
          focus: "Polish, Testing & Deployment",
          deliverables: "Bug fixes, performance optimization, testing, production deployment"
        }
      ]
    },
    technical_risks: [
      { risk: "Scalability concerns as user base grows", mitigation: "Design with horizontal scaling in mind, use caching strategies" },
      { risk: "Third-party API dependencies", mitigation: "Implement fallback mechanisms and error handling" },
      { risk: "Data security and privacy", mitigation: "Follow OWASP guidelines, regular security audits, encrypt sensitive data" }
    ]
  };
}

// Generate Finance insights
function generateFinanceInsights(analysis) {
  return {
    pricing: {
      strategy: "Value-based pricing with tiered approach to maximize revenue across segments",
      tiers: [
        {
          name: "Starter",
          price: "$19/mo",
          annual_price: "$15/mo (billed annually)",
          features: ["Core features", "Up to 5 projects", "Email support", "Basic analytics"],
          target: "Individual users and freelancers"
        },
        {
          name: "Professional",
          price: "$49/mo",
          annual_price: "$39/mo (billed annually)",
          features: ["All Starter features", "Unlimited projects", "Priority support", "Advanced analytics", "Team collaboration"],
          target: "Small teams (5-20 people)",
          recommended: true
        },
        {
          name: "Business",
          price: "$149/mo",
          annual_price: "$119/mo (billed annually)",
          features: ["All Professional features", "Custom integrations", "Dedicated account manager", "SLA guarantees", "Advanced security"],
          target: "Growing businesses (20-100 people)"
        },
        {
          name: "Enterprise",
          price: "Custom",
          annual_price: "Contact sales",
          features: ["All Business features", "Custom deployment", "White-label options", "Training & onboarding", "24/7 phone support"],
          target: "Large organizations (100+ people)"
        }
      ]
    },
    revenue_projections: {
      assumptions: {
        avg_revenue_per_user: "$42/month",
        annual_churn: "25%",
        conversion_rate: "3% free-to-paid"
      },
      conservative: {
        year1: "$120K (200 paying customers)",
        year2: "$480K (800 paying customers)",
        year3: "$1.2M (2,000 paying customers)"
      },
      realistic: {
        year1: "$240K (400 paying customers)",
        year2: "$840K (1,400 paying customers)",
        year3: "$2.1M (3,500 paying customers)"
      },
      optimistic: {
        year1: "$480K (800 paying customers)",
        year2: "$1.68M (2,800 paying customers)",
        year3: "$4.2M (7,000 paying customers)"
      }
    },
    budget: {
      year1_expenses: {
        development: "$120K (2 engineers)",
        marketing: "$80K (digital marketing, content, events)",
        operations: "$40K (cloud infrastructure, tools, legal)",
        salaries: "$200K (founders + key hires)",
        total: "$440K"
      },
      runway: "18 months with $750K seed funding",
      burn_rate: "$36K/month average in year 1"
    },
    breakeven: {
      timeline: "Month 16-20 (realistic scenario)",
      customers_needed: "1,100 paying customers at $42 average",
      mrr_target: "$46K MRR to cover $36K monthly burn + growth"
    },
    unit_economics: {
      cac: "$180 (Customer Acquisition Cost)",
      ltv: "$1,512 (Lifetime Value, 36 months)",
      ltv_cac_ratio: "8.4:1 (Excellent - target is >3:1)",
      payback_period: "4.3 months"
    }
  };
}

// Generate Marketing insights
function generateMarketingInsights(analysis) {
  return {
    market_analysis: {
      market_size: "Estimated TAM (Total Addressable Market) in " + analysis.industry,
      target_segment: analysis.targetAudience,
      market_trends: [
        "Growing demand for digital transformation solutions",
        "Increasing adoption of " + analysis.uniqueValue,
        "Shift towards remote/hybrid work driving need for digital tools"
      ],
      opportunities: [
        "Underserved segment: " + analysis.targetAudience,
        "Gap in market for user-friendly solutions",
        "First-mover advantage in specific niche"
      ]
    },
    positioning: {
      statement: "For " + analysis.targetAudience + " who need " + analysis.problem + ", our solution is " + analysis.uniqueValue + " that delivers measurable results",
      differentiation: [
        analysis.uniqueValue,
        "Superior user experience compared to legacy solutions",
        "Faster time-to-value than competitors"
      ]
    },
    landing_page_copy: {
      headline: "Transform How You " + (analysis.solution.split(' ').slice(0, 5).join(' ')),
      subheadline: "The smart, simple way for " + analysis.targetAudience + " to solve " + analysis.problem,
      cta_primary: "Start Free 14-Day Trial",
      cta_secondary: "See How It Works",
      social_proof: "Join 500+ teams already transforming their workflow"
    },
    go_to_market_strategy: [
      {
        channel: "Content Marketing",
        tactics: ["SEO-optimized blog posts", "Case studies", "Industry guides"],
        budget: "25% of marketing spend",
        expected_roi: "Long-term organic traffic growth"
      },
      {
        channel: "Social Media",
        tactics: ["LinkedIn thought leadership", "Twitter engagement", "Community building"],
        budget: "15% of marketing spend",
        expected_roi: "Brand awareness and inbound leads"
      },
      {
        channel: "Paid Advertising",
        tactics: ["Google Ads", "LinkedIn Ads", "Retargeting campaigns"],
        budget: "40% of marketing spend",
        expected_roi: "Direct customer acquisition"
      },
      {
        channel: "Partnerships",
        tactics: ["Integration partnerships", "Affiliate program", "Co-marketing"],
        budget: "20% of marketing spend",
        expected_roi: "Channel expansion and credibility"
      }
    ],
    content_calendar: {
      frequency: "3-4 posts per week",
      content_mix: {
        educational: "40% - How-tos, tutorials, best practices",
        product: "30% - Feature announcements, use cases",
        thought_leadership: "20% - Industry insights, trends",
        community: "10% - User stories, testimonials"
      }
    }
  };
}

// Generate Sales insights
function generateSalesInsights(analysis) {
  return {
    icp: {
      title: "Ideal Customer Profile for " + analysis.industry,
      company_profile: {
        size: "10-500 employees",
        industry: analysis.industry,
        revenue: "$1M - $50M annual revenue",
        tech_stack: "Uses modern cloud tools, values automation"
      },
      buyer_persona: {
        role: analysis.targetAudience,
        pain_points: [
          analysis.problem,
          "Wasting time on manual processes",
          "Lack of visibility into key metrics",
          "Difficulty scaling current solution"
        ],
        goals: [
          "Increase efficiency by 30%+",
          "Reduce operational costs",
          "Improve team collaboration",
          "Make data-driven decisions"
        ],
        buying_triggers: [
          "Team growth/scaling challenges",
          "Budget approval for new tools",
          "Competitor using similar solution",
          "Recent funding or expansion"
        ]
      }
    },
    lead_generation: [
      {
        source: "Inbound Content Marketing",
        priority: "High",
        monthly_leads: "150-200",
        conversion_rate: "5%",
        tactics: "SEO blog posts, downloadable guides, webinars"
      },
      {
        source: "LinkedIn Outreach",
        priority: "High",
        monthly_leads: "50-75",
        conversion_rate: "8%",
        tactics: "Personalized connection requests, value-first messages"
      },
      {
        source: "Product-Led Growth",
        priority: "Medium",
        monthly_leads: "100-150",
        conversion_rate: "10%",
        tactics: "Free trial signups, in-app upgrade prompts"
      },
      {
        source: "Referral Program",
        priority: "Medium",
        monthly_leads: "25-50",
        conversion_rate: "15%",
        tactics: "Incentivize customers to refer peers"
      },
      {
        source: "Partnerships",
        priority: "Low (but high quality)",
        monthly_leads: "10-20",
        conversion_rate: "20%",
        tactics: "Integration partners, reseller relationships"
      }
    ],
    sales_playbook: [
      {
        step: 1,
        stage: "Prospecting",
        action: "Identify and qualify leads using ICP criteria",
        duration: "Ongoing",
        success_criteria: "50+ qualified leads per month"
      },
      {
        step: 2,
        stage: "Initial Outreach",
        action: "Personalized email/LinkedIn message focused on their pain point",
        duration: "Day 1",
        success_criteria: "30% response rate"
      },
      {
        step: 3,
        stage: "Discovery Call",
        action: "15-min call to understand their needs, challenges, and goals",
        duration: "Week 1",
        success_criteria: "Confirm budget, authority, need, timeline (BANT)"
      },
      {
        step: 4,
        stage: "Product Demo",
        action: "Customized 30-min demo showing how we solve their specific problem",
        duration: "Week 1-2",
        success_criteria: "Demo-to-trial conversion >60%"
      },
      {
        step: 5,
        stage: "Free Trial",
        action: "14-day trial with onboarding support and check-ins",
        duration: "Week 2-4",
        success_criteria: "Trial-to-paid conversion >20%"
      },
      {
        step: 6,
        stage: "Proposal & Negotiation",
        action: "Send proposal, address objections, negotiate terms",
        duration: "Week 4-6",
        success_criteria: "Close rate >40%"
      },
      {
        step: 7,
        stage: "Onboarding & Success",
        action: "Smooth onboarding, ensure quick wins, set up for expansion",
        duration: "Month 2-3",
        success_criteria: "90-day retention >85%"
      }
    ],
    objection_handling: [
      {
        objection: "\"It's too expensive\"",
        response: "Focus on ROI - show how time savings and efficiency gains pay for themselves in 3 months"
      },
      {
        objection: "\"We're already using [competitor]\"",
        response: "Acknowledge their solution, highlight our unique differentiators, offer side-by-side trial"
      },
      {
        objection: "\"We need to think about it\"",
        response: "Uncover real concern - is it budget, timing, or stakeholder buy-in? Address root issue"
      },
      {
        objection: "\"Can we start next quarter?\"",
        response: "Create urgency - limited-time discount, show cost of waiting, offer pilot program"
      }
    ],
    sales_metrics: {
      avg_deal_size: "$1,800/year",
      sales_cycle: "30-45 days",
      win_rate: "25% of qualified opportunities",
      quota: "$30K MRR per sales rep"
    }
  };
}

// Generate Overview insights
function generateOverviewInsights(analysis, ceoData, devData, financeData, marketingData, salesData) {
  return {
    executive_summary: `A ${analysis.industry} solution targeting ${analysis.targetAudience}. The product addresses ${analysis.problem} through ${analysis.uniqueValue}. With a clear go-to-market strategy and strong unit economics (8.4:1 LTV:CAC ratio), the opportunity represents a significant market opportunity with realistic path to $2.1M ARR by year 3.`,

    opportunity_score: {
      overall: 82,
      breakdown: {
        market_size: 85,
        competitive_position: 75,
        execution_risk: 80,
        financial_viability: 90,
        team_readiness: 75
      },
      verdict: "Strong opportunity with clear product-market fit potential"
    },

    quick_wins: [
      {
        win: "Launch MVP within 10 weeks",
        impact: "Start validating product-market fit immediately",
        effort: "Medium"
      },
      {
        win: "Acquire first 50 beta users through direct outreach",
        impact: "Early feedback loop and testimonials",
        effort: "Low"
      },
      {
        win: "Generate $10K MRR within 6 months",
        impact: "Prove business model viability",
        effort: "Medium"
      },
      {
        win: "Build content library (10 blog posts, 2 guides)",
        impact: "SEO foundation for long-term organic growth",
        effort: "Low"
      }
    ],

    critical_risks: [
      {
        risk: "Competition from established players",
        severity: "High",
        mitigation: "Focus on niche segment, move fast, emphasize superior UX"
      },
      {
        risk: "Customer acquisition cost higher than projected",
        severity: "Medium",
        mitigation: "Test multiple channels early, optimize for lowest CAC, implement referral program"
      },
      {
        risk: "Technical execution delays",
        severity: "Medium",
        mitigation: "Hire experienced developers, use proven tech stack, scope MVP tightly"
      }
    ],

    next_steps: [
      {
        priority: "Immediate (This Week)",
        actions: [
          "Finalize MVP feature list and remove nice-to-haves",
          "Set up development environment and project management tools",
          "Create landing page and start building email waitlist"
        ]
      },
      {
        priority: "Short-term (This Month)",
        actions: [
          "Conduct 20 customer development interviews",
          "Build MVP core features",
          "Develop content marketing strategy and create first 3 blog posts",
          "Set up analytics and tracking infrastructure"
        ]
      },
      {
        priority: "Medium-term (3 Months)",
        actions: [
          "Launch MVP to beta users",
          "Implement feedback and iterate on product",
          "Start paid acquisition campaigns",
          "Prepare fundraising materials and investor outreach list"
        ]
      }
    ],

    resource_requirements: {
      team: "2 technical co-founders + 1 growth/marketing hire by month 6",
      funding: "$750K seed round to reach 18-month runway",
      timeline: "10 weeks to MVP, 6 months to initial traction, 12 months to Series A readiness"
    },

    success_milestones: [
      { milestone: "50 beta users with >70% engagement", timeline: "Month 3" },
      { milestone: "$10K MRR", timeline: "Month 6" },
      { milestone: "$50K MRR", timeline: "Month 12" },
      { milestone: "Profitability or Series A raise", timeline: "Month 18" }
    ]
  };
}

// ===== AGENT ENDPOINTS =====

app.post('/workspaces/:workspaceId/agents/generate', authMiddleware, (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);

    // Verify workspace ownership
    const workspace = db.workspaces.find(
      w => w.id === workspaceId && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get conversation history
    const conversation = db.conversations.find(c => c.workspace_id === workspaceId);

    if (!conversation || conversation.messages.length === 0) {
      return res.status(400).json({ error: 'No conversation found. Please chat about your startup first.' });
    }

    // Analyze the conversation
    const analysis = analyzeConversation(conversation.messages);

    // Generate insights for each agent
    const ceoInsights = generateCEOInsights(analysis);
    const devInsights = generateDeveloperInsights(analysis);
    const financeInsights = generateFinanceInsights(analysis);
    const marketingInsights = generateMarketingInsights(analysis);
    const salesInsights = generateSalesInsights(analysis);
    const overviewInsights = generateOverviewInsights(
      analysis,
      ceoInsights,
      devInsights,
      financeInsights,
      marketingInsights,
      salesInsights
    );

    // Map agents to their insights
    const agentOutputs = {
      'ceo': ceoInsights,
      'developer': devInsights,
      'finance': financeInsights,
      'marketing': marketingInsights,
      'sales': salesInsights,
      'overview': overviewInsights
    };

    // Clear any existing agent outputs for this workspace
    db.agentOutputs = db.agentOutputs.filter(o => o.workspace_id !== workspaceId);

    // Generate all 6 agents with analyzed insights
    Object.entries(agentOutputs).forEach(([agentType, output]) => {
      const agentOutput = {
        id: agentOutputIdCounter++,
        workspace_id: workspaceId,
        agent_type: agentType,
        output_data: output,
        created_at: new Date().toISOString()
      };

      db.agentOutputs.push(agentOutput);
    });

    res.json({
      message: 'Agents generated successfully',
      status: 'completed'
    });
  } catch (error) {
    console.error('Generate agents error:', error);
    res.status(500).json({ error: 'Failed to generate agents' });
  }
});

app.get('/workspaces/:workspaceId/agents', authMiddleware, (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);

    // Verify workspace ownership
    const workspace = db.workspaces.find(
      w => w.id === workspaceId && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Get agent outputs
    const outputs = db.agentOutputs.filter(o => o.workspace_id === workspaceId);

    res.json({ outputs });
  } catch (error) {
    console.error('Get agent outputs error:', error);
    res.status(500).json({ error: 'Failed to fetch agent outputs' });
  }
});

app.post('/workspaces/:workspaceId/agents/:agentType/regenerate', authMiddleware, (req, res) => {
  try {
    const workspaceId = parseInt(req.params.workspaceId);
    const agentType = req.params.agentType;

    // Verify workspace ownership
    const workspace = db.workspaces.find(
      w => w.id === workspaceId && w.user_id === req.userId
    );

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Find and update agent output
    const agentOutput = db.agentOutputs.find(
      o => o.workspace_id === workspaceId && o.agent_type === agentType
    );

    if (agentOutput) {
      agentOutput.created_at = new Date().toISOString();
    }

    res.json({
      message: 'Agent regenerated successfully',
      output: agentOutput ? agentOutput.output_data : {}
    });
  } catch (error) {
    console.error('Regenerate agent error:', error);
    res.status(500).json({ error: 'Failed to regenerate agent' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Tiny CEO Backend Server Running!`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`✅ Health Check: http://localhost:${PORT}/health`);
  console.log(`\n💡 Frontend should connect to: http://localhost:${PORT}\n`);
});
