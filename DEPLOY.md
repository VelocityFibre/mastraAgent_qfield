# QField Agent - Railway Deployment Guide

## ✅ Configuration Complete

Your project is configured to deploy **only the QField agent** to Railway.

---

## 🚀 Deploy to Railway (Web Interface - Easiest)

### Step 1: Push to GitHub (if not already done)
```bash
cd "/home/louisdup/Agents/Mastra/mastra agent builder"
git init
git add .
git commit -m "QField agent ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Railway
1. Go to https://railway.app/
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the Node.js project

### Step 3: Set Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
DEPLOY_MODE=qfield
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=file:./mastra.db
```

**Important:** Copy your actual OpenAI API key from `.env` file (never commit API keys to GitHub).

### Step 4: Deploy
- Railway will automatically build and deploy
- You'll get a URL like: `https://your-project.up.railway.app`

---

## 🔧 Alternative: Railway CLI Method

If you want to use CLI:

```bash
# Install Railway CLI (needs sudo)
sudo npm install -g @railway/cli

# Login
railway login

# Link to project or create new
railway init

# Set environment variables
railway variables set DEPLOY_MODE=qfield
railway variables set OPENAI_API_KEY="your-key-here"
railway variables set DATABASE_URL="file:./mastra.db"

# Deploy
railway up
```

---

## 📋 What Was Configured

### 1. **Agent Filtering** (`src/mastra/index.ts`)
- Added environment variable check: `DEPLOY_MODE=qfield`
- When set, only `qfieldAssistantAgent` is loaded
- Locally (without env var), all agents remain available

### 2. **Railway Config** (`railway.toml`)
- Build system: nixpacks (auto-detects Node.js)
- Start command: `npm run start`
- Auto-restart on failure

### 3. **Ignore File** (`.railwayignore`)
- Excludes: node_modules, logs, local database, notes

---

## 🧪 Test Locally First

Test QField-only mode before deploying:

```bash
# Set environment variable
export DEPLOY_MODE=qfield

# Restart server
cd "/home/louisdup/Agents/Mastra/mastra agent builder"
npm run dev
```

Visit http://localhost:4113/ - you should see only QField agent.

To revert to all agents:
```bash
unset DEPLOY_MODE
npm run dev
```

---

## 🌐 After Deployment

Your users will access:
- **URL:** `https://your-project.up.railway.app/`
- **UI:** Identical to your local interface
- **Agent:** Only QField assistant visible
- **Features:** Full chat, history, model selection

---

## 💡 Next Steps

1. Deploy to Railway using web interface (recommended)
2. Share the Railway URL with Juan and team
3. Test the deployed agent
4. Monitor usage in Railway dashboard

---

## 🔒 Security Note

The OpenAI API key in this file should be kept secure. Consider:
- Using Railway's secret management
- Rotating keys regularly
- Setting usage limits on OpenAI dashboard
