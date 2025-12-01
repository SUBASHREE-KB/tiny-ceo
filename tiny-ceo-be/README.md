# Tiny CEO - Backend API v2.0

Intelligent multi-agent startup analysis system with real AI reasoning, web search capabilities, and per-agent chat functionality.

## Features

- **6 Specialized AI Agents**: CEO, Developer, Finance, Marketing, Sales, and Overview agents provide comprehensive startup analysis
- **Real AI Integration**: Supports OpenAI, Anthropic, or intelligent fallback mode
- **Web Search**: Integrated search for competitors, market trends, and pricing data
- **Per-Agent Chat**: Chat with each agent individually for specific questions
- **Modular Architecture**: Clean, maintainable code structure
- **JWT Authentication**: Secure user authentication
- **RESTful API**: Well-structured API endpoints

## Architecture

```
tiny-ceo-be/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.js  # In-memory database
│   │   ├── ai.js        # AI provider configuration
│   │   └── constants.js # App constants
│   │
│   ├── middleware/      # Express middleware
│   │   ├── auth.js      # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js   # Request validation
│   │
│   ├── models/          # Data models (represented in database.js)
│   │
│   ├── routes/          # API routes
│   │   ├── auth.routes.js
│   │   ├── workspace.routes.js
│   │   ├── conversation.routes.js
│   │   ├── agent.routes.js
│   │   └── agentChat.routes.js
│   │
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.js
│   │   ├── workspace.controller.js
│   │   ├── conversation.controller.js
│   │   ├── agent.controller.js
│   │   └── agentChat.controller.js
│   │
│   ├── services/        # Business logic
│   │   ├── ai.service.js          # AI API integration
│   │   ├── search.service.js      # Web search
│   │   ├── analysis.service.js    # Conversation analysis
│   │   └── orchestrator.service.js # Agent coordination
│   │
│   ├── agents/          # Intelligent agents
│   │   ├── base.agent.js       # Base agent class
│   │   ├── ceo.agent.js        # Strategy & competition
│   │   ├── developer.agent.js  # Tech & architecture
│   │   ├── finance.agent.js    # Pricing & projections
│   │   ├── marketing.agent.js  # GTM & positioning
│   │   ├── sales.agent.js      # ICP & playbook
│   │   └── overview.agent.js   # Executive summary
│   │
│   ├── utils/           # Utilities
│   │   ├── logger.js    # Logging
│   │   ├── helpers.js   # Helper functions
│   │   └── prompts.js   # AI prompts
│   │
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
└── package.json
```

## Setup

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd tiny-ceo-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional - uses intelligent fallback by default):
```env
# Server
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production

# AI Provider (optional - defaults to intelligent fallback)
AI_PROVIDER=fallback  # Options: 'openai', 'anthropic', 'fallback'
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

# Search Provider (optional - defaults to intelligent fallback)
SEARCH_PROVIDER=fallback  # Options: 'serpapi', 'brave', 'google', 'fallback'
# SERPAPI_KEY=...
# BRAVE_SEARCH_KEY=...

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

4. Start the server:
```bash
npm start
```

The server will run on http://localhost:3001

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user }
```

### Workspaces

All workspace endpoints require authentication via `Authorization: Bearer <token>` header.

#### Get All Workspaces
```
GET /workspaces
```

#### Get Workspace
```
GET /workspaces/:id
```

#### Create Workspace
```
POST /workspaces
Content-Type: application/json

{
  "title": "My Startup Idea",
  "startup_idea_text": "Optional initial description"
}
```

#### Update Workspace
```
PUT /workspaces/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Conversations

#### Get Conversation Messages
```
GET /workspaces/:workspaceId/conversations
```

#### Send Message
```
POST /workspaces/:workspaceId/conversations/message
Content-Type: application/json

{
  "message": "Tell me about my startup idea"
}

Response: { message, response }
```

### Agents

#### Generate All Agents
```
POST /workspaces/:workspaceId/agents/generate

Response: { message, status: 'completed' }
```

This triggers analysis from all 6 agents based on the conversation.

#### Get Agent Outputs
```
GET /workspaces/:workspaceId/agents

Response: { outputs: [...] }
```

#### Regenerate Specific Agent
```
POST /workspaces/:workspaceId/agents/:agentType/regenerate

Agent Types: 'ceo', 'developer', 'finance', 'marketing', 'sales', 'overview'

Response: { message, output }
```

### Agent Chat

#### Chat with Agent
```
POST /workspaces/:workspaceId/agents/:agentType/chat
Content-Type: application/json

{
  "message": "Should I use React or Vue for my frontend?"
}

Response: { response, agent, role }
```

#### Get Chat History
```
GET /workspaces/:workspaceId/agents/:agentType/chat

Response: { chats: [...] }
```

## Agent Capabilities

### CEO Agent
- Competitive analysis with web search
- Market trend analysis
- Fundraising strategy
- Growth roadmap
- Risk assessment and pivot signals

### Developer Agent
- Tech stack recommendations
- System architecture design
- MVP feature scoping
- Development timeline estimation
- Technical risk identification

### Finance Agent
- Tiered pricing strategy
- Revenue projections (3 scenarios)
- Unit economics (CAC, LTV, payback)
- Budget planning
- Breakeven analysis

### Marketing Agent
- Market sizing (TAM, SAM, SOM)
- Competitive positioning
- Go-to-market strategy
- Content and channel recommendations
- Launch planning

### Sales Agent
- Ideal Customer Profile (ICP)
- Buyer persona development
- Lead generation strategy
- Sales playbook creation
- Objection handling

### Overview Agent
- Executive summary
- Opportunity scoring (0-100)
- Quick wins identification
- Risk prioritization
- Action plan with timelines

## Intelligent Fallback Mode

The system works WITHOUT any API keys by using intelligent pattern matching and analysis:

- **AI Service**: Uses smart templates and conversation analysis
- **Search Service**: Provides industry-specific benchmarks and mock data based on detected industry
- **All Agents**: Generate comprehensive, contextual insights even without external APIs

This allows you to:
1. Test the full system immediately
2. Demo to users without API costs
3. Add real API keys later for enhanced capabilities

## Adding Real AI Integration

### OpenAI Setup
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
```

### Anthropic Setup
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Web Search Setup
```env
SEARCH_PROVIDER=serpapi
SERPAPI_KEY=your-key-here
```

## Error Handling

All endpoints return structured error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (in development mode)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (not owner)
- 404: Not Found
- 500: Internal Server Error

## Logging

The system uses a custom logger with colored output:

- `INFO` (blue): General information
- `SUCCESS` (green): Successful operations
- `WARN` (yellow): Warnings
- `ERROR` (red): Errors
- `AGENT` (cyan): Agent-specific logs

## Development

### Project Structure
- **Routes**: Define API endpoints
- **Controllers**: Handle request/response logic
- **Services**: Business logic and external integrations
- **Agents**: Specialized analysis logic
- **Middleware**: Authentication, validation, error handling
- **Utils**: Helper functions and utilities

### Adding a New Agent

1. Create agent file in `src/agents/`
2. Extend `BaseAgent` class
3. Implement `analyze()` and optionally `chat()` methods
4. Add agent to `orchestrator.service.js`
5. Update `AGENT_TYPES` in `constants.js`

### Testing

Use tools like Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:3001/health

# Register
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## Production Deployment

### Checklist
- [ ] Set strong `JWT_SECRET` in production
- [ ] Use PostgreSQL or MongoDB instead of in-memory database
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring (DataDog, Sentry)
- [ ] Configure CI/CD pipeline
- [ ] Add API keys for real AI and search services
- [ ] Set up backup strategy

### Environment Variables
Ensure all sensitive data is in environment variables, never committed to code.

## Contributing

1. Follow the existing code structure
2. Add error handling for all async operations
3. Use the logger for all console output
4. Write descriptive commit messages
5. Test endpoints before committing

## License

ISC

## Support

For issues or questions, create an issue in the repository.
