# Tiny CEO - AI-Powered Startup Analysis Platform

> **🏆 LiquidMetal Raindrop + Vultr Hackathon Project**

An intelligent multi-agent AI platform that helps entrepreneurs validate and build their startup ideas through comprehensive analysis from 6 specialized AI agents, powered by Raindrop MCP and deployed on Vultr infrastructure.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Raindrop MCP](https://img.shields.io/badge/Raindrop-MCP-purple.svg)](https://raindrop.com)
[![Vultr](https://img.shields.io/badge/Vultr-Cloud-blue.svg)](https://vultr.com)

## 🌟 What's New in 2.0

**Complete Raindrop MCP + Vultr Integration!**

- ✅ **SmartSQL**: All data persisted in PostgreSQL (no more in-memory storage)
- ✅ **SmartMemory**: Intelligent caching for user profiles and sessions
- ✅ **SmartInference**: Multi-model AI routing (Claude Opus/Sonnet/Haiku)
- ✅ **Vultr Object Storage**: Cloud file storage for PDFs and exports
- ✅ **Vultr Compute**: Production deployment on Ubuntu VM
- ✅ **PDF Export**: Generate and store analysis reports
- ✅ **Chat History**: Persistent conversations with agents
- ✅ **User Management**: Real authentication and user profiles

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- Raindrop MCP Server access
- Vultr account (for production deployment)

### Local Development

1. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/tiny-ceo.git
   cd tiny-ceo

   # Backend
   cd tiny-ceo-be
   npm install

   # Frontend
   cd ../tiny-ceo-fe
   npm install
   ```

2. **Configure Backend**
   ```bash
   cd tiny-ceo-be
   cp .env.example .env
   # Edit .env with your credentials:
   # - RAINDROP_MCP_URL
   # - RAINDROP_API_KEY
   # - VULTR_S3_* credentials
   ```

3. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd tiny-ceo-be
   npm start          # Runs on http://localhost:3001

   # Terminal 2: Frontend
   cd tiny-ceo-fe
   npm run dev        # Runs on http://localhost:5173
   ```

4. **Access the App**
   - Frontend: http://localhost:5173
   - API Health: http://localhost:3001/health

## 🏗️ Architecture

```
User Browser → Vultr Object Storage (Frontend)
           ↓
    Vultr Compute VM (Backend)
           ↓
    Raindrop MCP Server
    ├─ SmartSQL (Data)
    ├─ SmartMemory (Cache)
    └─ SmartInference (AI)
           ↓
    Vultr Object Storage (Files)
```

**Detailed architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## ✨ Features

### 🤖 Multi-Agent AI Analysis
- **CEO Agent**: Strategic vision, partnerships, competitive positioning
- **Finance Agent**: Revenue models, unit economics, funding requirements
- **Marketing Agent**: Market analysis, GTM strategy, customer acquisition
- **Sales Agent**: Sales processes, pricing, conversion optimization
- **Developer Agent**: Tech stack, architecture, MVP features, roadmap
- **Overview Agent**: Executive summary, startup naming, action plan

### 💾 Smart Data Management
- **SmartSQL**: PostgreSQL database for persistent storage
- **SmartMemory**: Redis-like caching for fast access
- **User Profiles**: Preferences, stats, onboarding state
- **Chat History**: All conversations persisted
- **Multi-version Outputs**: Track agent regenerations

### ☁️ Cloud Integration
- **Vultr Compute**: Production-ready backend hosting
- **Vultr Object Storage**: S3-compatible file storage
- **PDF Generation**: Export analysis reports
- **JSON Export**: Download structured data
- **Public Download URLs**: Share files easily

### 💬 Interactive Chat
- Chat with any agent for detailed help
- Context-aware responses
- Conversation history tracking
- Agent-specific personalities

### 📊 Visual Dashboards
- Market size and trend charts
- Revenue projection graphs
- Customer metrics visualization
- Tech stack diagrams
- Architecture visualizations

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Complete system architecture and data flow |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Step-by-step Vultr deployment guide |
| [HACKATHON.md](./HACKATHON.md) | Hackathon submission details |
| [MCP_INTEGRATION.md](./MCP_INTEGRATION.md) | Raindrop MCP integration guide |
| [RAINDROP_QUICKSTART.md](./RAINDROP_QUICKSTART.md) | Quick start for Raindrop users |

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI framework
- **Vite** - Build tool
- **Recharts** 3.5.1 - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Node.js** 20.x - Runtime
- **Express** 5.1.0 - Web framework
- **JWT** - Authentication
- **PM2** - Process management (production)
- **NGINX** - Reverse proxy (production)

### Raindrop MCP
- **SmartSQL** - PostgreSQL database
- **SmartMemory** - Redis-like caching
- **SmartInference** - Claude Opus/Sonnet/Haiku

### Vultr
- **Cloud Compute** - Ubuntu 22.04 VM
- **Object Storage** - S3-compatible file storage

### AI Models
- **Claude Opus 4.5** - Strategic analysis (CEO agent)
- **Claude Sonnet 4.5** - General analysis (Finance, Marketing, Sales, Developer)
- **Claude Haiku 4.5** - Fast chat responses

## 🚀 Deployment

### Deploy to Vultr

**Quick Deploy**:
```bash
# 1. Create Vultr resources (see DEPLOYMENT.md)
# 2. SSH to your VM
ssh root@your-vultr-ip

# 3. Clone and setup
cd /var/www
git clone your-repo.git tiny-ceo
cd tiny-ceo/tiny-ceo-be
npm install

# 4. Configure environment
cp .env.example .env
nano .env  # Add your credentials

# 5. Start backend
pm2 start src/server.js --name tiny-ceo-api
pm2 save

# 6. Deploy frontend
cd ../tiny-ceo-fe
npm install && npm run build
aws s3 sync dist/ s3://tiny-ceo-files/frontend/ \
  --endpoint-url https://ewr1.vultrobjects.com \
  --acl public-read
```

**Complete guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
tiny-ceo/
├── raindrop-config/          # Raindrop MCP configuration
│   ├── raindrop-server.json  # Server config
│   ├── smartsql-schema.sql   # Database schema
│   └── smart-memory-init.js  # Memory initialization
│
├── tiny-ceo-be/              # Backend (Node.js + Express)
│   ├── src/
│   │   ├── services/         # Raindrop & Vultr services
│   │   │   ├── raindrop.service.js
│   │   │   ├── smartsql.service.js
│   │   │   ├── smartmemory.service.js
│   │   │   ├── smartinference.service.js
│   │   │   └── vultr-storage.service.js
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   └── app.js
│   └── package.json
│
├── tiny-ceo-fe/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API client
│   │   └── App.jsx
│   └── package.json
│
├── deployment/               # Deployment automation
│   ├── vultr/
│   │   ├── setup-vm.sh      # VM setup script
│   │   ├── nginx.conf       # NGINX config
│   │   └── pm2.config.js    # PM2 config
│   └── terraform/           # Infrastructure as code
│
└── docs/                     # Documentation
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    └── HACKATHON.md
```

## 🔧 API Endpoints

### Workspaces
- `GET /workspaces` - List all workspaces
- `GET /workspaces/:id` - Get workspace
- `POST /workspaces` - Create workspace
- `PUT /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace

### Agents
- `POST /workspaces/:id/agents/generate` - Generate all agent analyses
- `GET /workspaces/:id/agents` - Get agent outputs
- `POST /workspaces/:id/agents/:type/regenerate` - Regenerate specific agent

### Chat
- `POST /workspaces/:id/chat/:agentType` - Chat with agent
- `GET /workspaces/:id/chat/:agentType/history` - Get chat history

### Files
- `POST /workspaces/:id/files/export-pdf` - Export as PDF
- `POST /workspaces/:id/files/export-json` - Export as JSON
- `GET /workspaces/:id/files` - List files
- `POST /workspaces/:id/files/upload` - Upload file

## 📊 Performance

- **AI Analysis**: 30-60 seconds (6 agents in parallel)
- **Chat Response**: 1-3 seconds (Claude Haiku)
- **Database Query**: <50ms (with SmartMemory cache)
- **PDF Generation**: 2-5 seconds
- **File Upload**: 1-3 seconds to Vultr S3

## 🧪 Testing

```bash
# Test MCP integration
node test-mcp.js

# Backend tests
cd tiny-ceo-be
npm test

# Frontend tests
cd tiny-ceo-fe
npm test
```

## 🐛 Troubleshooting

### Backend won't connect to Raindrop?
```bash
# Check Raindrop URL and API key in .env
# Test connection:
curl -H "Authorization: Bearer $RAINDROP_API_KEY" $RAINDROP_MCP_URL/info
```

### Can't upload to Vultr Object Storage?
```bash
# Verify S3 credentials in .env
# Test with AWS CLI:
aws s3 ls --endpoint-url https://ewr1.vultrobjects.com
```

### Frontend can't reach backend?
- Check CORS settings in backend `.env`
- Verify `VITE_API_URL` in frontend `.env`
- Check firewall rules on Vultr VM

**Full troubleshooting**: [DEPLOYMENT.md](./DEPLOYMENT.md#troubleshooting)

## 🙏 Acknowledgments

- **LiquidMetal** - Hackathon organizer
- **Raindrop** - MCP Smart Components platform
- **Vultr** - Cloud infrastructure
- **Anthropic** - Claude AI models
- **Claude Code** - AI coding assistant

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/tiny-ceo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tiny-ceo/discussions)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Team collaboration
- [ ] Pitch deck slide generation
- [ ] Integration with Crunchbase/PitchBook
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Custom agent marketplace

---

**Built with ❤️ for the LiquidMetal Raindrop + Vultr Hackathon**

**Stack**: Raindrop MCP | Vultr | Claude AI | React | Node.js

**Version**: 2.0.0 (Raindrop + Vultr Edition)
