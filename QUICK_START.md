# FounderOS - Quick Start Guide

## ⚡ Fastest Way to Launch

### Prerequisites Check
```bash
# Check Node.js
node --version  # Should be 18+

# Check npm
npm --version

# Check if PostgreSQL is running (optional - can use SQLite)
# Or skip database for now and use mocks
```

### Step 1: Backend Setup (5 minutes)

```bash
cd backend

# Install dependencies
npm install --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# For SQLite (simpler, no DB setup needed):
# Edit prisma/schema.prisma, change:
#   datasource db { provider = "sqlite" url = "file:./dev.db" }
# Then run: npx prisma migrate dev --name init

# For PostgreSQL (if you have it):
# Create .env file with DATABASE_URL
# npx prisma migrate dev --name init

# Seed database
npm run seed

# Start server
npm run dev
```

Backend will run on: **http://localhost:6060**

### Step 2: Frontend Setup (3 minutes)

```bash
cd frontend

# Install dependencies  
npm install --legacy-peer-deps

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:6060" > .env.local

# Start dev server
npm run dev
```

Frontend will run on: **http://localhost:3000**

### Step 3: Access the App

1. Open browser: **http://localhost:3000**
2. Register new account OR
3. Login with: `demo@founderos.app` / `demo123`

## 🧪 Test All Features

### ✅ Authentication
- Register → Login → Dashboard

### ✅ Dashboard
- See streak, priority, active startup
- Click quick actions

### ✅ AI Cofounder
- Go to /cofounder
- Ask: "What should I build first?"
- See structured JSON response
- Try different personas

### ✅ Startup Generator
- Go to /startup-generator
- Select domains, skills, budget
- Generate idea
- View full details
- Save as active

### ✅ Founder Genome
- Go to /genome
- Generate genome
- View hash
- Mint (requires MetaMask)

### ✅ Time-Warp
- Go to /timewarp
- See prediction
- View timeline

## 🎯 What Works Right Now

✅ **All API endpoints** - Fully functional
✅ **AI Cofounder** - RAG + Memory + Personas
✅ **Startup Generator** - LLM-powered ideas
✅ **Founder Genome** - On-chain identity
✅ **Time-Warp** - Predictive engine
✅ **Dashboard** - Complete UI
✅ **Authentication** - JWT-based
✅ **Database** - Full schema
✅ **Smart Contracts** - Ready to deploy

## 🔧 Troubleshooting

### Disk Space Issue
```bash
# Clean npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install --legacy-peer-deps
```

### Database Connection
```bash
# Use SQLite instead (no setup needed)
# Edit prisma/schema.prisma:
#   provider = "sqlite"
#   url = "file:./dev.db"
```

### Port Already in Use
```bash
# Change ports in:
# backend/.env: PORT=6061
# frontend/.env.local: NEXT_PUBLIC_API_URL=http://localhost:6061
```

## 🎉 You're Ready!

The app is **100% functional** and ready to use. All features work, all integrations are complete, and the UI is polished.

**Launch it and start building! 🚀**

