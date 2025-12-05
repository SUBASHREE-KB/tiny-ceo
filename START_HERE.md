# Tiny CEO - Setup Guide

## Quick Setup

### 1. Install Dependencies
```bash
npm install
cd tiny-ceo-be && npm install
cd ../tiny-ceo-fe && npm install
```

### 2. Configure API Key
Get your API key: https://aistudio.google.com/apikey

Edit `tiny-ceo-be/.env`:
```env
GEMINI_API_KEY=your_key_here
```

### 3. Start Servers

**Terminal 1 - Backend:**
```bash
cd tiny-ceo-be
npm start
```

**Terminal 2 - Frontend:**
```bash
cd tiny-ceo-fe
npm run dev
```

### 4. Open Browser
Navigate to: http://localhost:5173

---

## Usage

1. Register/Login
2. Chat about your startup (2+ messages)
3. Click "Create Startup Space"
4. View AI insights from 6 agents

---

## Troubleshooting

**Backend won't start?**
- Check port 3001 is available
- Verify `.env` file exists
- Check API key is valid

**Frontend won't start?**
- Check port 5173 is available
- Clear node_modules: `rm -rf node_modules && npm install`

**Agent generation fails?**
- Ensure 2+ meaningful messages
- Check backend logs for errors
- Verify API key is working

---

## Documentation

- **README.md** - Main documentation
- **AGENT_GENERATION_FIXED.md** - Agent generation details

---

**Quick Links:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Get API Key: https://aistudio.google.com/apikey
