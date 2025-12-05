# Tiny CEO - AI-Powered Startup Command Center

Your complete startup advisory system with 6 specialized AI agents!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd tiny-ceo-be
npm install

# Install frontend dependencies
cd ../tiny-ceo-fe
npm install
```

### 2. Configure API Key

Get a free Gemini API key at: https://aistudio.google.com/apikey

Then edit `tiny-ceo-be/.env`:
```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the Application

**Backend** (Terminal 1):
```bash
cd tiny-ceo-be
npm start
```
Running at: http://localhost:3001

**Frontend** (Terminal 2):
```bash
cd tiny-ceo-fe
npm run dev
```
Running at: http://localhost:5173

### 4. Open Your Browser

Go to: http://localhost:5173

---

## 📁 Project Structure

```
startup-agent/
├── tiny-ceo-be/          # Backend (Express API)
│   ├── src/
│   │   ├── agents/       # AI agent implementations
│   │   ├── controllers/  # API controllers
│   │   ├── services/     # Business logic
│   │   └── routes/       # API routes
│   └── .env             # Configuration (API keys)
│
├── tiny-ceo-fe/         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── utils/       # API helpers
│   └── index.html
│
└── README.md            # This file
```

---

## ✨ Features

### Intelligent Conversation
Chat with an AI that learns from your input and asks smart follow-up questions about your startup idea.

### 6 AI Agents Generate Insights
After your conversation, generate comprehensive analysis from:

1. **CEO Agent** - Competition, roadmap, fundraising
2. **Developer Agent** - Tech stack, MVP features, timeline
3. **Finance Agent** - Pricing, revenue projections, unit economics
4. **Marketing Agent** - Market analysis, positioning, go-to-market
5. **Sales Agent** - ICP, lead generation, sales playbook
6. **Overview Agent** - Executive summary, risks, next steps

### Personalized Analysis
The AI analyzes YOUR specific conversation to extract:
- Problem you're solving
- Target customers
- Industry & competition
- Business model
- Unique value proposition

---

## 🎯 Usage Flow

1. **Register** an account
2. **Chat** about your startup (2+ messages)
3. **Create Workspace** to generate AI insights
4. **View** personalized analysis from all 6 agents

---

## 💾 Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4
- React Router
- Lucide Icons

### Backend
- Node.js + Express 5
- Google Gemini AI API
- JWT Authentication
- In-memory database

---

## 📖 Documentation

- **AGENT_GENERATION_FIXED.md** - Details on how agent generation works
- **START_HERE.md** - Comprehensive setup guide

---

## ⚙️ Configuration

### Backend (.env file)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
PORT=3001
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### Frontend (src/config/api.js)
```javascript
export const API_BASE_URL = 'http://localhost:3001';
```

---

## 🔧 Troubleshooting

### Backend won't start?
- Check if port 3001 is already in use
- Verify `.env` file exists in `tiny-ceo-be/`
- Ensure dependencies are installed: `cd tiny-ceo-be && npm install`

### Frontend won't start?
- Check if port 5173 is already in use
- Ensure dependencies are installed: `cd tiny-ceo-fe && npm install`
- Clear cache: `rm -rf node_modules && npm install`

### API connection errors?
- Ensure backend is running before starting frontend
- Check that `API_BASE_URL` in frontend matches backend port
- Check browser console for CORS errors

### Database errors?
- App uses in-memory database (data resets on backend restart)
- This is normal for development

---

## ⚠️ Important Notes

### In-Memory Database
- ✅ Perfect for testing and development
- ✅ Fast and simple
- ❌ Data resets when you restart the server
- ❌ Need to register again after restart

### Security
- Never commit `.env` files to git (already in `.gitignore`)
- Keep your API keys private
- Change JWT_SECRET for production
- Add API restrictions in Google Cloud Console

---

## 📞 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Workspaces
- `GET /workspaces` - Get all workspaces
- `POST /workspaces` - Create new workspace
- `GET /workspaces/:id` - Get workspace by ID

### Conversations
- `GET /workspaces/:id/conversations` - Get messages
- `POST /workspaces/:id/conversations/message` - Send message

### Agents
- `POST /workspaces/:id/agents/generate` - Generate all agents
- `GET /workspaces/:id/agents` - Get agent outputs
- `POST /workspaces/:id/agents/:type/regenerate` - Regenerate agent

---

## 🎉 What's Working

✅ Real AI-powered conversations
✅ Dynamic, contextual responses
✅ Workspace creation and management
✅ 6 specialized AI agents
✅ Customized startup analysis
✅ User authentication

---

## 📊 Quick Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health
- Get API Key: https://aistudio.google.com/apikey

---

**Built with**: React, Express, Tailwind CSS, JWT, Google Gemini AI
**Status**: ✅ Fully functional
**Last Updated**: 2025-12-05

Happy Building! 🚀
