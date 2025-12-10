# Tiny CEO - LiquidMetal Raindrop + Vultr Hackathon Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                                │
│                     (Tiny CEO Frontend)                              │
│                  React App + Raindrop UI                             │
└────────────────┬────────────────────────────────────────────────────┘
                 │ HTTPS
                 │
┌────────────────▼────────────────────────────────────────────────────┐
│                  VULTR OBJECT STORAGE                                │
│              Static Site Hosting + CDN                               │
│          (Frontend: index.html, bundle.js, assets)                   │
└────────────────┬────────────────────────────────────────────────────┘
                 │ REST API
                 │
┌────────────────▼────────────────────────────────────────────────────┐
│                     VULTR COMPUTE VM                                 │
│                   Ubuntu 22.04 LTS                                   │
│            Node.js 20 + Express + PM2 + NGINX                        │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Tiny CEO Backend API                           │   │
│  │  - /api/workspaces (CRUD)                                   │   │
│  │  - /api/generate-analysis (AI agents)                       │   │
│  │  - /api/chat (agent chat)                                   │   │
│  │  - /api/files (upload/download)                             │   │
│  │  - /api/user-profile (memory)                               │   │
│  └────────┬───────────┬──────────┬─────────────────────────────┘   │
│           │           │          │                                   │
└───────────┼───────────┼──────────┼───────────────────────────────────┘
            │           │          │
            │           │          └─────────────────────┐
            │           │                                │
┌───────────▼───────────▼────────────────────┐  ┌────────▼──────────┐
│      RAINDROP MCP SERVER                   │  │  VULTR OBJECT     │
│    (SmartComponents Platform)              │  │    STORAGE        │
│                                             │  │  (S3 Compatible)  │
│  ┌─────────────────────────────────────┐  │  │                    │
│  │  SmartSQL (PostgreSQL)              │  │  │  Buckets:          │
│  │  ├─ users                           │  │  │  ├─ pitch-decks/   │
│  │  ├─ workspaces                      │  │  │  ├─ analysis/      │
│  │  ├─ startup_ideas                   │  │  │  ├─ exports/       │
│  │  ├─ agent_outputs                   │  │  │  └─ documents/     │
│  │  ├─ chat_history                    │  │  │                    │
│  │  └─ file_metadata                   │  │  └────────────────────┘
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  SmartMemory (Key-Value Store)      │  │
│  │  ├─ user_profiles                   │  │
│  │  ├─ user_preferences                │  │
│  │  ├─ session_data                    │  │
│  │  └─ agent_contexts                  │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  SmartInference (LLM Gateway)       │  │
│  │  ├─ Claude Opus (strategic)         │  │
│  │  ├─ Claude Sonnet (analysis)        │  │
│  │  ├─ GPT-4 (fallback)                │  │
│  │  └─ Model routing + caching         │  │
│  └─────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

## 🎯 Hackathon Compliance Checklist

### ✅ Raindrop MCP Integration (Multiple Components)
- **SmartSQL**: All workspace, user, and analysis data
- **SmartMemory**: User profiles, preferences, session state
- **SmartInference**: All AI agent generation (CEO, Finance, Marketing, Sales, Developer)

### ✅ Vultr Services Integration
- **Vultr Compute**: Ubuntu VM hosting Node.js backend
- **Vultr Object Storage**: File storage for PDFs, pitch decks, exports
- **Vultr Object Storage**: Static site hosting for React frontend

### ✅ AI Coding Assistant Usage
- Claude Code generating complete codebase
- AI-powered architecture design
- Automated deployment scripts

### ✅ Significant Updates from Original
- Complete database migration to SmartSQL (from in-memory)
- User authentication and profiles via SmartMemory
- File export/storage system via Vultr
- Multi-agent chat history persistence
- Production-ready deployment on Vultr

## 📊 Data Flow

### 1. User Creates Workspace
```
User → Frontend → POST /api/workspaces
              ↓
         Backend validates
              ↓
    SmartSQL.insert('workspaces', data)
              ↓
    SmartMemory.set('recent_workspace', id)
              ↓
         Return workspace
```

### 2. Generate AI Analysis
```
User → Frontend → POST /api/generate-analysis
              ↓
         Backend fetches workspace from SmartSQL
              ↓
    For each agent (CEO, Finance, Marketing, Sales, Developer):
         SmartInference.generate(prompt, context)
              ↓
    SmartSQL.insert('agent_outputs', results)
              ↓
    Return all agent analyses
```

### 3. Export Pitch Deck
```
User → Frontend → POST /api/export-pitchdeck
              ↓
         Backend generates PDF from analysis
              ↓
    Vultr.ObjectStorage.upload('pitch-decks/', pdf)
              ↓
    SmartSQL.insert('file_metadata', {url, workspace_id})
              ↓
         Return download URL
```

### 4. Chat with Agent
```
User → Frontend → POST /api/chat
              ↓
         Backend loads context from SmartSQL
              ↓
    SmartMemory.get('agent_context_' + agentType)
              ↓
    SmartInference.generate(message, context)
              ↓
    SmartSQL.insert('chat_history', {message, response})
              ↓
         Return AI response
```

## 🗄️ SmartSQL Schema

### users table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  auth_token VARCHAR(512),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

### workspaces table
```sql
CREATE TABLE workspaces (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  startup_idea TEXT NOT NULL,
  industry VARCHAR(100),
  target_audience TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### agent_outputs table
```sql
CREATE TABLE agent_outputs (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  agent_type VARCHAR(50) NOT NULL, -- 'ceo', 'finance', 'marketing', 'sales', 'developer', 'overview'
  output_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### chat_history table
```sql
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  agent_type VARCHAR(50) NOT NULL,
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### file_metadata table
```sql
CREATE TABLE file_metadata (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER REFERENCES workspaces(id),
  file_type VARCHAR(50), -- 'pitchdeck', 'analysis', 'export'
  file_name VARCHAR(255),
  storage_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 💾 SmartMemory Buckets

### User Profile Memory
```javascript
{
  key: `user_profile:${userId}`,
  value: {
    name: "John Doe",
    preferences: {
      defaultIndustry: "SaaS",
      theme: "dark",
      notifications: true
    },
    stats: {
      workspacesCreated: 12,
      analysesGenerated: 45,
      chatMessages: 234
    }
  }
}
```

### Session Memory
```javascript
{
  key: `session:${sessionId}`,
  value: {
    userId: 123,
    currentWorkspaceId: 456,
    agentContexts: {
      ceo: "Last discussed market positioning...",
      developer: "Building REST API for..."
    },
    expiresAt: 1735200000
  }
}
```

### Agent Context Memory
```javascript
{
  key: `agent_context:${workspaceId}:${agentType}`,
  value: {
    conversationHistory: [...],
    lastTopics: ["pricing", "GTM strategy"],
    userPreferences: "detailed technical answers"
  }
}
```

## 🤖 SmartInference Usage

### CEO Agent Analysis
```javascript
const analysis = await raindrop.smartInference({
  model: 'claude-opus-4-5',
  prompt: `Analyze this startup idea as a CEO...`,
  context: {
    workspaceData: workspace,
    industry: workspace.industry,
    targetAudience: workspace.target_audience
  },
  temperature: 0.7,
  maxTokens: 2000
});
```

### Developer Agent Code Generation
```javascript
const code = await raindrop.smartInference({
  model: 'claude-sonnet-4-5',
  prompt: `Generate REST API code for...`,
  context: {
    techStack: developerOutput.tech_stack,
    architecture: developerOutput.architecture
  },
  temperature: 0.3,
  maxTokens: 4000
});
```

## 🚀 Deployment Architecture

### Vultr Resources Needed

1. **Compute Instance**
   - Type: Cloud Compute
   - OS: Ubuntu 22.04 LTS
   - Size: 2 vCPU, 4GB RAM (or higher)
   - Location: Closest to your users
   - Firewall: Allow 80, 443, 22

2. **Object Storage**
   - Bucket: `tiny-ceo-files`
   - Access: Public read for download URLs
   - CORS: Enabled for frontend uploads
   - CDN: Optional for faster delivery

3. **Block Storage** (optional)
   - Size: 100GB
   - Use: Backend logs, temp files
   - Mount: `/mnt/tiny-ceo-data`

### Environment Variables

```bash
# Raindrop MCP
RAINDROP_MCP_URL=wss://your-raindrop-server.com
RAINDROP_API_KEY=your_raindrop_api_key

# Vultr Object Storage (S3 Compatible)
VULTR_S3_ENDPOINT=ewr1.vultrobjects.com
VULTR_S3_ACCESS_KEY=your_access_key
VULTR_S3_SECRET_KEY=your_secret_key
VULTR_S3_BUCKET=tiny-ceo-files

# Backend
PORT=3001
NODE_ENV=production
JWT_SECRET=your_jwt_secret

# Frontend URL
FRONTEND_URL=https://tiny-ceo.yourdomain.com
```

## 📁 Updated Folder Structure

```
tiny-ceo/
├── raindrop-config/
│   ├── raindrop-server.json       # Raindrop MCP configuration
│   ├── smartsql-schema.sql        # Database schema
│   └── smart-memory-init.js       # Memory initialization
│
├── tiny-ceo-be/                   # Backend (Node.js)
│   ├── src/
│   │   ├── services/
│   │   │   ├── raindrop.service.js      # Raindrop MCP client
│   │   │   ├── smartsql.service.js      # SmartSQL operations
│   │   │   ├── smartmemory.service.js   # SmartMemory operations
│   │   │   ├── smartinference.service.js # SmartInference calls
│   │   │   └── vultr-storage.service.js  # Vultr S3 client
│   │   ├── controllers/
│   │   │   ├── workspace.controller.js   # Updated for SmartSQL
│   │   │   ├── agent.controller.js       # Updated for SmartInference
│   │   │   ├── file.controller.js        # NEW: File upload/download
│   │   │   └── user.controller.js        # NEW: User management
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── tiny-ceo-fe/                   # Frontend (React)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.service.js           # Updated API calls
│   │   ├── components/
│   │   │   ├── UserProfile.jsx          # NEW: User profile
│   │   │   ├── FileExport.jsx           # NEW: Export controls
│   │   │   └── ...existing components
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── deployment/
│   ├── vultr/
│   │   ├── setup-vm.sh                  # VM setup script
│   │   ├── nginx.conf                   # NGINX config
│   │   ├── pm2.config.js                # PM2 config
│   │   └── deploy-frontend.sh           # Deploy to Vultr Object Storage
│   ├── terraform/
│   │   ├── main.tf                      # Vultr resources
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── docker/
│       └── Dockerfile                   # Optional containerization
│
├── docs/
│   ├── ARCHITECTURE.md                  # This file
│   ├── DEPLOYMENT.md                    # Deployment guide
│   └── HACKATHON.md                     # Hackathon submission details
│
└── README.md
```

## 🎬 Next Steps

1. ✅ Create Raindrop MCP Server configuration
2. ✅ Implement SmartSQL schema
3. ✅ Build Raindrop service layer in backend
4. ✅ Migrate existing agents to SmartInference
5. ✅ Add Vultr Object Storage integration
6. ✅ Update frontend to use new APIs
7. ✅ Create deployment scripts
8. ✅ Test end-to-end on Vultr
9. ✅ Prepare hackathon demo
