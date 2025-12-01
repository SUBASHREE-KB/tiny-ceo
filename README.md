# Tiny CEO - AI-Powered Startup Command Center

Your complete startup advisory system with 6 specialized AI agents!

## 📁 Project Structure

```
startup-agent/
├── tiny-ceo-fe/          # Frontend (React + Vite)
├── tiny-ceo-be/          # Backend (Express API)
├── HOW_TO_USE.md         # Complete usage guide
└── FOLDER_STRUCTURE.md   # Detailed folder explanation
```

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd tiny-ceo-be
npm start
```
**Running at**: http://localhost:3001

### 2. Start Frontend
```bash
cd tiny-ceo-fe
npm run dev
```
**Running at**: http://localhost:5173

### 3. Open Your Browser
Go to: **http://localhost:5173**

---

## ✨ What This App Does

### Intelligent Conversation
Chat with an AI that learns from your input and asks smart follow-up questions about your startup idea.

### 6 AI Agents Generate Insights
After your conversation, generate comprehensive analysis from:

1. **CEO Strategy** - Competition, roadmap, fundraising
2. **Developer** - Tech stack, MVP features, timeline
3. **Finance** - Pricing, revenue projections, unit economics
4. **Marketing** - Market analysis, positioning, go-to-market
5. **Sales** - ICP, lead generation, sales playbook
6. **Overview** - Executive summary, risks, next steps

### Personalized Analysis
The AI analyzes YOUR specific conversation to extract:
- Problem you're solving
- Target customers
- Industry & competition
- Business model
- Unique value proposition

Then generates customized insights for YOUR startup!

---

## 📖 Documentation

- **HOW_TO_USE.md** - Complete user guide with examples
- **FOLDER_STRUCTURE.md** - Detailed folder organization

---

## 🎯 Usage Flow

1. **Register** an account
2. **Chat** about your startup (4+ messages)
3. **Create Workspace** to generate AI insights
4. **View** personalized analysis from all 6 agents

---

## 💾 Tech Stack

### Frontend (`tiny-ceo-fe/`)
- React + Vite
- Tailwind CSS
- React Router
- Lucide Icons

### Backend (`tiny-ceo-be/`)
- Express.js
- JWT Authentication
- In-memory database
- CORS enabled

---

## ⚠️ Important Notes

### In-Memory Database
The backend uses in-memory storage, so:
- ✅ Perfect for testing and development
- ✅ Fast and simple
- ❌ Data resets when you restart the server
- ❌ Need to register again after restart

### Login Issues?
If you get a 401 error:
1. The backend was restarted (which cleared all users)
2. Just register again with any email/password
3. You'll be logged in automatically

---

## 🎉 Features

✅ Intelligent AI conversation (adapts to your input)
✅ Context-aware questions (not predefined)
✅ 6 specialized AI agents
✅ Personalized startup analysis
✅ Investment-ready insights
✅ Executive summaries
✅ Competitive analysis
✅ Financial projections
✅ Go-to-market strategy
✅ Sales playbook
✅ Technical roadmap

---

## 🔧 Troubleshooting

**Backend not responding?**
```bash
cd tiny-ceo-be
npm start
```

**Frontend not loading?**
```bash
cd tiny-ceo-fe
npm run dev
```

**401 Unauthorized?**
- Register a new account (backend was restarted)

**More help?**
- See `HOW_TO_USE.md` for detailed troubleshooting

---

## 📞 Quick Links

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

---

**Built with**: React, Express, Tailwind CSS, JWT
**Status**: Fully functional (in-memory storage)
**Last Updated**: 2025-11-29
